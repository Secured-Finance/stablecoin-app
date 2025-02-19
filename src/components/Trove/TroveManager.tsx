/* eslint-disable no-console */
import {
    Decimal,
    Decimalish,
    MINIMUM_DEBT,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import { useCallback, useEffect } from 'react';
import { Alert, Button, ButtonVariants } from 'src/components/atoms';
import {
    SfStablecoinStoreUpdate,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { useMyTransactionState } from '../Transaction';
import { useTroveView } from './context/TroveViewContext';
import { TroveAction } from './TroveAction';
import { TroveEditor } from './TroveEditor';
import {
    selectForTroveChangeValidation,
    validateTroveChange,
} from './validation/validateTroveChange';

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
    const [{ original, edited, changePending }, dispatch] =
        useSfStablecoinReducer(reduce, init);
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

    const handleCancel = useCallback(() => {
        dispatchEvent('CANCEL_ADJUST_TROVE_PRESSED');
    }, [dispatchEvent]);

    const openingNewTrove = original.isEmpty;

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
        <TroveEditor
            original={original}
            edited={edited}
            changePending={changePending}
            dispatch={dispatch}
        >
            {description ??
                (openingNewTrove ? (
                    <Alert color='info'>
                        Start by entering the amount of {CURRENCY} you would
                        like to deposit as collateral.
                    </Alert>
                ) : (
                    <Alert color='info'>
                        Adjust your Trove by modifying its collateral, debt, or
                        both.
                    </Alert>
                ))}

            <div className='flex justify-end gap-2'>
                <Button
                    variant={ButtonVariants.tertiary}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                {validChange ? (
                    <TroveAction
                        transactionId={`${transactionIdPrefix}${validChange.type}`}
                        change={validChange}
                        maxBorrowingRate={maxBorrowingRate}
                        borrowingFeeDecayToleranceMinutes={60}
                    >
                        Confirm
                    </TroveAction>
                ) : (
                    <Button disabled>Confirm</Button>
                )}
            </div>
        </TroveEditor>
    );
};
