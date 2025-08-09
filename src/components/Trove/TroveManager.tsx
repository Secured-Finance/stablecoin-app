/* eslint-disable no-console */
import {
    Decimal,
    Decimalish,
    MINIMUM_DEBT,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import { useEffect } from 'react';
import { Button } from 'src/components/atoms';
import {
    SfStablecoinStoreUpdate,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { useMyTransactionState } from '../Transaction';
import { useTroveView } from './context/TroveViewContext';
import { TroveAction } from './TroveAction';
import {
    selectForTroveChangeValidation,
    validateTroveChange,
} from './validation/validateTroveChange';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
const init = ({ trove }: SfStablecoinStoreState) => ({
    original: trove,
    edited: new Trove(trove.collateral, trove.debt),
    changePending: false,
    debtDirty: false,
    addedMinimumDebt: false,
});

type TroveManagerState = ReturnType<typeof init>;
type TroveManagerAction =
    | SfStablecoinStoreUpdate
    | {
          type:
              | 'startChange'
              | 'finishChange'
              | 'revert'
              | 'addMinimumDebt'
              | 'removeMinimumDebt';
      }
    | { type: 'setCollateral' | 'setDebt'; newValue: Decimalish };

const reduceWith =
    (action: TroveManagerAction) =>
    (state: TroveManagerState): TroveManagerState =>
        reduce(state, action);

const addMinimumDebt = reduceWith({ type: 'addMinimumDebt' });
const removeMinimumDebt = reduceWith({ type: 'removeMinimumDebt' });
const finishChange = reduceWith({ type: 'finishChange' });
const revert = reduceWith({ type: 'revert' });

const reduce = (
    state: TroveManagerState,
    action: TroveManagerAction
): TroveManagerState => {
    const { original, edited, changePending, debtDirty, addedMinimumDebt } =
        state;

    switch (action.type) {
        case 'startChange': {
            console.log('starting change');
            return { ...state, changePending: true };
        }

        case 'finishChange':
            return { ...state, changePending: false };

        case 'setCollateral': {
            const newCollateral = Decimal.from(action.newValue);

            const newState = {
                ...state,
                edited: edited.setCollateral(newCollateral),
            };

            if (!debtDirty) {
                if (edited.isEmpty && newCollateral.nonZero) {
                    return addMinimumDebt(newState);
                }
                if (addedMinimumDebt && newCollateral.isZero) {
                    return removeMinimumDebt(newState);
                }
            }

            return newState;
        }

        case 'setDebt':
            return {
                ...state,
                edited: edited.setDebt(action.newValue),
                debtDirty: true,
            };

        case 'addMinimumDebt':
            return {
                ...state,
                edited: edited.setDebt(MINIMUM_DEBT),
                addedMinimumDebt: true,
            };

        case 'removeMinimumDebt':
            return {
                ...state,
                edited: edited.setDebt(0),
                addedMinimumDebt: false,
            };

        case 'revert':
            return {
                ...state,
                edited: new Trove(original.collateral, original.debt),
                debtDirty: false,
                addedMinimumDebt: false,
            };

        case 'updateStore': {
            const {
                newState: { trove },
                stateChange: { troveBeforeRedistribution: changeCommitted },
            } = action;

            const newState = {
                ...state,
                original: trove,
            };

            if (changePending && changeCommitted) {
                return finishChange(revert(newState));
            }

            const change = original.whatChanged(edited, 0);

            if (
                (change?.type === 'creation' && !trove.isEmpty) ||
                (change?.type === 'closure' && trove.isEmpty)
            ) {
                return revert(newState);
            }

            return { ...newState, edited: trove.apply(change, 0) };
        }
    }
};

const select = (state: SfStablecoinStoreState) => ({
    fees: state.fees,
    validationContext: selectForTroveChangeValidation(state),
});

const transactionIdPrefix = 'trove-';
const transactionIdMatcher = new RegExp(`^${transactionIdPrefix}`);

type TroveManagerProps = {
    collateral?: Decimalish;
    debt?: Decimalish;
};

// XXX Only used for closing Troves now
export const TroveManager: React.FC<TroveManagerProps> = ({
    collateral,
    debt,
}) => {
    const [{ original, edited }, dispatch] = useSfStablecoinReducer(
        reduce,
        init
    );
    const { fees, validationContext } = useSfStablecoinSelector(select);

    useEffect(() => {
        if (collateral !== undefined) {
            dispatch({ type: 'setCollateral', newValue: collateral });
        }
        if (debt !== undefined) {
            dispatch({ type: 'setDebt', newValue: debt });
        }
    }, [collateral, debt, dispatch]);

    const borrowingRate = fees.borrowingRate();
    const maxBorrowingRate = borrowingRate.add(0.005); // WONT-FIX slippage tolerance

    const [validChange, description] = validateTroveChange(
        original,
        edited,
        borrowingRate,
        validationContext
    );

    const { dispatchEvent } = useTroveView();

    const myTransactionState = useMyTransactionState(transactionIdMatcher);

    useEffect(() => {
        if (
            myTransactionState.type === 'waitingForApproval' ||
            myTransactionState.type === 'waitingForConfirmation'
        ) {
            dispatch({ type: 'startChange' });
        } else if (
            myTransactionState.type === 'failed' ||
            myTransactionState.type === 'cancelled'
        ) {
            dispatch({ type: 'finishChange' });
        } else if (myTransactionState.type === 'confirmedOneShot') {
            if (myTransactionState.id === `${transactionIdPrefix}closure`) {
                dispatchEvent('TROVE_CLOSED');
            } else {
                dispatchEvent('TROVE_ADJUSTED');
            }
        }
    }, [myTransactionState, dispatch, dispatchEvent]);

    return (
        <>
            {description}
            <p className='mb-6 text-center text-sm text-[#565656]'>
                Closing your Trove will repay all your debt and return your
                remaining collateral.
            </p>

            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                <div className='mb-6'>
                    <span className='mb-2 block text-sm font-medium'>
                        You will repay
                    </span>
                    <div className='flex items-center'>
                        <input
                            type='text'
                            value={debt?.toString()}
                            readOnly
                            className='text-xl h-12 flex-1 rounded-md border border-[#e3e3e3] bg-white px-3 py-2 font-bold'
                        />
                        <div className='ml-4 flex items-center gap-2'>
                            <SecuredFinanceLogo />
                        </div>
                    </div>
                    <p className='mt-1 text-sm text-[#565656]'>
                        ${debt?.toString()}
                    </p>
                </div>

                <div className='mb-6'>
                    <span className='mb-2 block text-sm font-medium'>
                        You will reclaim
                    </span>
                    <div className='flex items-center'>
                        <input
                            type='text'
                            value='331.24'
                            readOnly
                            className='text-xl h-12 flex-1 rounded-md border border-[#e3e3e3] bg-white px-3 py-2 font-bold'
                        />
                        <div className='ml-4 flex items-center gap-2'>
                            <FILIcon />
                            <span className='font-medium'>FIL</span>
                        </div>
                    </div>
                    <p className='mt-1 text-sm text-[#565656]'>$1463.26</p>
                </div>
            </div>

            {validChange ? (
                <TroveAction
                    transactionId={`${transactionIdPrefix}${validChange.type}`}
                    change={validChange}
                    maxBorrowingRate={maxBorrowingRate}
                    borrowingFeeDecayToleranceMinutes={60}
                >
                    Repay & Close Trove
                </TroveAction>
            ) : (
                <Button className='text-lg w-full bg-[#1a30ff] py-4 hover:bg-[#0f1b99]'>
                    Repay & Close Trove
                </Button>
            )}

            <p className='mt-2 text-center text-sm text-[#565656]'>
                This action will open your wallet to sign the transaction.
            </p>
        </>
    );
};
