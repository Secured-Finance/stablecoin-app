import {
    Decimal,
    Difference,
    LIQUIDATION_RESERVE,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'src/components/atoms';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { DEBT_TOKEN_PRECISION } from 'src/utils';
import { useStableTroveChange } from '../../hooks/useStableTroveChange';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';
import { TroveAction } from './TroveAction';
import { useTroveView } from './context/TroveViewContext';
import {
    selectForTroveChangeValidation,
    validateTroveChange,
} from './validation/validateTroveChange';

import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';

const selector = (state: SfStablecoinStoreState) => {
    const { trove, fees, price, accountBalance } = state;
    return {
        trove,
        fees,
        price,
        accountBalance,
        validationContext: selectForTroveChangeValidation(state),
    };
};

const TRANSACTION_ID = 'trove-adjustment';
const GAS_ROOM_ETH = Decimal.from(0.1);

const feeFrom = (
    original: Trove,
    edited: Trove,
    borrowingRate: Decimal
): Decimal => {
    const change = original.whatChanged(edited, borrowingRate);

    if (
        change &&
        change.type !== 'invalidCreation' &&
        change.params.borrowDebtToken
    ) {
        return change.params.borrowDebtToken.mul(borrowingRate);
    } else {
        return Decimal.ZERO;
    }
};

const applyUnsavedCollateralChanges = (
    unsavedChanges: Difference,
    trove: Trove
) => {
    if (unsavedChanges.absoluteValue) {
        if (unsavedChanges.positive) {
            return trove.collateral.add(unsavedChanges.absoluteValue);
        }
        if (unsavedChanges.negative) {
            if (unsavedChanges.absoluteValue.lt(trove.collateral)) {
                return trove.collateral.sub(unsavedChanges.absoluteValue);
            }
        }
        return trove.collateral;
    }
    return trove.collateral;
};

const applyUnsavedNetDebtChanges = (
    unsavedChanges: Difference,
    trove: Trove
) => {
    if (unsavedChanges.absoluteValue) {
        if (unsavedChanges.positive) {
            return trove.netDebt.add(unsavedChanges.absoluteValue);
        }
        if (unsavedChanges.negative) {
            if (unsavedChanges.absoluteValue.lt(trove.netDebt)) {
                return trove.netDebt.sub(unsavedChanges.absoluteValue);
            }
        }
        return trove.netDebt;
    }
    return trove.netDebt;
};

export const Adjusting: React.FC = () => {
    const { dispatchEvent } = useTroveView();
    const { trove, fees, price, accountBalance, validationContext } =
        useSfStablecoinSelector(selector);
    const previousTrove = useRef<Trove>(trove);
    const [collateral, setCollateral] = useState<Decimal>(trove.collateral);
    const [netDebt, setNetDebt] = useState<Decimal>(trove.netDebt);
    const [isClosing, setIsClosing] = useState(false);

    const transactionState = useMyTransactionState(TRANSACTION_ID);
    const borrowingRate = fees.borrowingRate();

    const { sfStablecoin } = useSfStablecoin();
    const [sendTransaction] = useTransactionFunction(
        'closure',
        sfStablecoin.send.closeTrove.bind(sfStablecoin.send)
    );

    useEffect(() => {
        if (transactionState.type === 'confirmedOneShot') {
            dispatchEvent('TROVE_ADJUSTED');
        }
    }, [transactionState.type, dispatchEvent]);

    useEffect(() => {
        if (!previousTrove.current.collateral.eq(trove.collateral)) {
            const unsavedChanges = Difference.between(
                collateral,
                previousTrove.current.collateral
            );
            const nextCollateral = applyUnsavedCollateralChanges(
                unsavedChanges,
                trove
            );
            setCollateral(nextCollateral);
        }
        if (!previousTrove.current.netDebt.eq(trove.netDebt)) {
            const unsavedChanges = Difference.between(
                netDebt,
                previousTrove.current.netDebt
            );
            const nextNetDebt = applyUnsavedNetDebtChanges(
                unsavedChanges,
                trove
            );
            setNetDebt(nextNetDebt);
        }
        previousTrove.current = trove;
    }, [trove, collateral, netDebt]);

    const isDirty =
        !collateral.eq(trove.collateral) || !netDebt.eq(trove.netDebt);
    const isDebtIncrease = netDebt.gt(trove.netDebt);
    const debtIncreaseAmount = isDebtIncrease
        ? netDebt.sub(trove.netDebt)
        : Decimal.ZERO;

    const fee = isDebtIncrease
        ? feeFrom(
              trove,
              new Trove(trove.collateral, trove.debt.add(debtIncreaseAmount)),
              borrowingRate
          )
        : Decimal.ZERO;
    const totalDebt = netDebt.add(LIQUIDATION_RESERVE).add(fee);
    const maxBorrowingRate = borrowingRate.add(0.005);
    const updatedTrove = isDirty ? new Trove(collateral, totalDebt) : trove;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const feePct = new Percent(borrowingRate);
    const availableEth = accountBalance.gt(GAS_ROOM_ETH)
        ? accountBalance.sub(GAS_ROOM_ETH)
        : Decimal.ZERO;
    const maxCollateral = trove.collateral.add(availableEth);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const collateralMaxedOut = collateral.eq(maxCollateral);
    const collateralRatio =
        !collateral.isZero && !netDebt.isZero
            ? updatedTrove.collateralRatio(price)
            : undefined;
    const collateralRatioChange = Difference.between(
        collateralRatio,
        trove.collateralRatio(price)
    );

    const [troveChange, description] = validateTroveChange(
        trove,
        updatedTrove,
        borrowingRate,
        validationContext
    );

    const stableTroveChange = useStableTroveChange(troveChange);
    // const [gasEstimationState, setGasEstimationState] =
    //     useState<GasEstimationState>({ type: 'idle' });

    // const isTransactionPending =
    //     transactionState.type === 'waitingForApproval' ||
    //     transactionState.type === 'waitingForConfirmation';

    if (trove.status !== 'open') {
        return null;
    }

    return (
        <>
            {description}
            <div className='mb-6 mt-4 flex overflow-hidden rounded-xl border border-[#e3e3e3] bg-[#F5f5f5]'>
                <button
                    className={`flex-1 rounded-xl py-2 font-medium text-[#565656] ${
                        !isClosing
                            ? 'border border-[#E3E3E3] bg-white'
                            : 'bg-[#F5f5f5]'
                    }`}
                    onClick={() => setIsClosing(false)}
                >
                    Update Trove
                </button>
                <button
                    className={`flex-1 rounded-xl py-2 font-medium text-[#565656] ${
                        isClosing
                            ? 'border border-[#E3E3E3] bg-white'
                            : 'bg-[#F5f5f5]'
                    }`}
                    onClick={() => setIsClosing(true)}
                >
                    Close Trove
                </button>
            </div>

            {!isClosing ? (
                <>
                    <p className='mb-6 text-left text-sm text-[#565656]'>
                        Update your Trove by modifying its collateral, borrowed
                        amount, or both.
                    </p>

                    <div className='mb-6 '>
                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <span className='mb-2 block text-sm font-medium'>
                                Collateral
                            </span>
                            <div className='flex items-center'>
                                <div className='flex grow'>
                                    <input
                                        type='number'
                                        value={collateral.prettify()}
                                        onChange={e =>
                                            setCollateral(
                                                Decimal.from(
                                                    e.target.value || '0'
                                                )
                                            )
                                        }
                                        className='h-12 min-w-0 flex-1 rounded-md border-none px-3 py-2 font-primary text-8 font-medium '
                                    />
                                </div>
                                <div className='ml-4 flex min-w-[90px] items-center justify-end gap-2'>
                                    <FILIcon />
                                    <span className='font-medium'>FIL</span>
                                </div>
                            </div>
                            <p className='mt-1 text-sm text-[#565656]'>
                                {collateral.div(price).sub(fee).prettify()}
                            </p>
                        </div>

                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <span className='mb-2 block text-sm font-medium'>
                                Borrowed Amount
                            </span>
                            <div className='flex items-center'>
                                <div className='flex grow'>
                                    <input
                                        type='text'
                                        value={totalDebt.prettify()}
                                        onChange={e =>
                                            setNetDebt(
                                                Decimal.from(
                                                    e.target.value || '0'
                                                )
                                            )
                                        }
                                        className='h-12 min-w-0 flex-1 rounded-md border-none px-3 py-2 font-primary text-8 font-medium '
                                    />
                                </div>
                                <div className='ml-4 flex min-w-[90px] items-center justify-end gap-2'>
                                    <SecuredFinanceLogo />
                                </div>
                            </div>
                            <p className='mt-1 text-sm text-[#565656]'>
                                {totalDebt.prettify()}
                            </p>
                        </div>
                    </div>

                    <div className='mb-6 space-y-4'>
                        <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <div className='flex items-start justify-between'>
                                <div className='max-w-[60%] text-sm text-[#565656]'>
                                    <h3 className='mb-1 text-left text-sm text-[#565656]'>
                                        New Collateral Ratio
                                    </h3>
                                    The ratio of deposited FIL to borrowed
                                    USDFC. If it falls below 110% (or 150% in
                                    Recovery Mode), liquidation may occur.
                                </div>
                                <p className='text-right font-bold'>
                                    {collateralRatioChange.absoluteValue?.prettify()}
                                    %
                                </p>
                            </div>
                        </div>

                        <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <div className='flex items-start justify-between'>
                                <div className='max-w-[60%] text-sm text-[#565656]'>
                                    <h3 className='mb-1 text-left text-sm text-[#565656]'>
                                        New Liquidation Risk
                                    </h3>
                                    The risk of losing your FIL collateral if
                                    your Collateral Ratio drops below 110% under
                                    normal conditions or 150% in Recovery Mode.
                                </div>
                                <div>
                                    <div className='flex items-center justify-end gap-2'>
                                        <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                        <span className='font-medium text-green-700'>
                                            {/* {liquidationRisk} */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-bold'>Total Debt</h3>
                            <div className='flex items-center gap-1'>
                                <span className='font-bold'>
                                    {totalDebt.prettify(DEBT_TOKEN_PRECISION)}
                                </span>
                                <SecuredFinanceLogo />
                            </div>
                        </div>
                    </div>

                    {stableTroveChange ? (
                        <TroveAction
                            transactionId={TRANSACTION_ID}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                        >
                            Update Trove
                        </TroveAction>
                    ) : (
                        <Button
                            disabled
                            className='text-lg w-full bg-[#ccc] py-4'
                        >
                            Update Trove
                        </Button>
                    )}
                    <p className='mt-2 text-center text-sm text-[#565656]'>
                        This action will open your wallet to sign the
                        transaction.
                    </p>
                </>
            ) : (
                <>
                    <p className='mb-6 text-center text-sm text-[#565656]'>
                        Closing your Trove will repay all your debt and return
                        your remaining collateral.
                    </p>

                    <div className='mb-6 '>
                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <span className='mb-2 block text-sm font-medium'>
                                You will repay
                            </span>
                            <div className='flex items-center'>
                                <input
                                    type='text'
                                    value={totalDebt.prettify(2)}
                                    readOnly
                                    className='h-12 min-w-0 flex-1 rounded-md border-none px-3 py-2 font-primary text-8 font-medium '
                                />
                                <div className='ml-4 flex items-center gap-2'>
                                    <SecuredFinanceLogo />
                                </div>
                            </div>
                            <p className='mt-1 text-sm text-[#565656]'>
                                ${totalDebt.prettify()}
                            </p>
                        </div>

                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <span className='mb-2 block text-sm font-medium'>
                                You will reclaim
                            </span>
                            <div className='flex items-center'>
                                <input
                                    type='text'
                                    value={collateral.prettify()}
                                    readOnly
                                    className='h-12 min-w-0 flex-1 rounded-md border-none px-3 py-2 font-primary text-8 font-medium '
                                />
                                <div className='ml-4 flex items-center gap-2'>
                                    <FILIcon />
                                    <span className='font-medium'>FIL</span>
                                </div>
                            </div>
                            <p className='mt-1 text-sm text-[#565656]'>
                                ${collateral.div(price).sub(fee).prettify()}
                            </p>
                        </div>
                    </div>

                    {stableTroveChange ? (
                        <TroveAction
                            transactionId={'closure'}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                        >
                            Repay & Close Trove
                        </TroveAction>
                    ) : (
                        <Button
                            onClick={() => sendTransaction()}
                            className='text-lg w-full bg-[#1a30ff] py-4 hover:bg-[#0f1b99]'
                        >
                            Repay & Close Trove
                        </Button>
                    )}
                    <p className='mt-2 text-center text-sm text-[#565656]'>
                        This action will open your wallet to sign the
                        transaction.
                    </p>
                </>
            )}
        </>
    );
};
