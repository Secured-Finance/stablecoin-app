import {
    Decimal,
    Difference,
    LIQUIDATION_RESERVE,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { useEffect, useRef, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { Button, InputBox, TabSwitcher } from 'src/components/atoms';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { DEBT_TOKEN_PRECISION } from 'src/utils';
import { useStableTroveChange } from '../../hooks/useStableTroveChange';
import { USDFCIcon, USDFCIconLarge } from '../SecuredFinanceLogo';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';
import { TroveAction } from './TroveAction';
import { useTroveView } from './context/TroveViewContext';
import {
    selectForTroveChangeValidation,
    validateTroveChange,
} from './validation/validateTroveChange';

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
    const { trove, fees, price, validationContext } =
        useSfStablecoinSelector(selector);
    const previousTrove = useRef<Trove>(trove);
    const [collateral, setCollateral] = useState<Decimal>(trove.collateral);
    const [netDebt, setNetDebt] = useState<Decimal>(trove.netDebt);
    const [collateralInput, setCollateralInput] = useState<string>(
        trove.collateral.prettify()
    );
    const [netDebtInput, setNetDebtInput] = useState<string>(
        trove.netDebt.prettify()
    );
    const [editingField, setEditingField] = useState<
        'collateral' | 'netDebt' | undefined
    >(undefined);
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
            // Reset fields to current trove values after successful transaction
            setCollateral(trove.collateral);
            setNetDebt(trove.netDebt);
            setCollateralInput(trove.collateral.prettify());
            setNetDebtInput(trove.netDebt.prettify());
            setEditingField(undefined);
        }
    }, [transactionState.type, dispatchEvent, trove.collateral, trove.netDebt]);

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
            if (editingField !== 'collateral') {
                setCollateralInput(nextCollateral.prettify());
            }
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
            if (editingField !== 'netDebt') {
                setNetDebtInput(nextNetDebt.prettify());
            }
        }
        previousTrove.current = trove;
    }, [trove, collateral, netDebt, editingField]);

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
    const collateralRatio =
        !collateral.isZero && !netDebt.isZero
            ? updatedTrove.collateralRatio(price)
            : undefined;

    // Calculate liquidation risk based on collateral ratio
    const getLiquidationRisk = (ratio?: Decimal) => {
        if (!ratio)
            return {
                text: 'Unknown',
                color: 'text-neutral-600',
                bg: 'bg-neutral-100',
                dotBg: 'bg-neutral-400',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                color: 'text-success-700',
                bg: 'bg-success-100',
                dotBg: 'bg-success-500',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                color: 'text-success-700',
                bg: 'bg-success-100',
                dotBg: 'bg-success-500',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                color: 'text-warning-700',
                bg: 'bg-warning-100',
                dotBg: 'bg-warning-500',
            };
        return {
            text: 'High',
            color: 'text-error-700',
            bg: 'bg-error-100',
            dotBg: 'bg-error-500',
        };
    };

    const liquidationRisk = getLiquidationRisk(collateralRatio);

    const [troveChange, description] = validateTroveChange(
        trove,
        updatedTrove,
        borrowingRate,
        validationContext
    );

    const stableTroveChange = useStableTroveChange(troveChange);

    if (trove.status !== 'open') {
        return null;
    }

    return (
        <>
            <div className='mb-4'>{description}</div>
            <TabSwitcher
                activeTab={isClosing ? 'close' : 'update'}
                setActiveTab={tab => setIsClosing(tab === 'close')}
                disabled={false}
                tabs={[
                    { key: 'update', label: 'Update Trove' },
                    { key: 'close', label: 'Close Trove' },
                ]}
            />

            {!isClosing ? (
                <>
                    <p className='mb-6 text-left text-sm text-gray-500'>
                        Update your Trove by modifying its collateral, borrowed
                        amount, or both.
                    </p>

                    <div className='mb-6'>
                        <InputBox
                            label='Collateral'
                            type='text'
                            value={collateralInput}
                            onFocus={() => setEditingField('collateral')}
                            onBlur={() => setEditingField(undefined)}
                            onChange={value => {
                                if (/^\d*\.?\d*$/.test(value)) {
                                    setCollateralInput(value);
                                    setCollateral(Decimal.from(value || '0'));
                                }
                            }}
                            tokenIcon={
                                <>
                                    <FILIcon className='h-8 w-8' />
                                    <span className='text-2xl font-medium leading-none'>
                                        FIL
                                    </span>
                                </>
                            }
                            subLabel={`$${collateral.mul(price).prettify()}`}
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                        />

                        <InputBox
                            label='Borrowed Amount'
                            type='text'
                            value={netDebtInput}
                            onFocus={() => setEditingField('netDebt')}
                            onBlur={() => setEditingField(undefined)}
                            onChange={value => {
                                if (/^\d*\.?\d*$/.test(value)) {
                                    setNetDebtInput(value);
                                    setNetDebt(Decimal.from(value || '0'));
                                }
                            }}
                            tokenIcon={
                                <>
                                    <USDFCIconLarge />
                                    <span className='text-2xl font-medium leading-none'>
                                        USDFC
                                    </span>
                                </>
                            }
                            subLabel={`$${totalDebt.prettify()}`}
                        />
                    </div>

                    <div className='mb-6 space-y-4'>
                        <div className='rounded-xl border border-neutral-9 bg-white p-6'>
                            <div className='flex items-start justify-between'>
                                <div className='max-w-[60%] text-sm text-gray-500'>
                                    <h3 className='mb-1 text-left text-sm font-bold text-gray-500'>
                                        New Collateral Ratio
                                    </h3>
                                    The ratio of deposited FIL to borrowed
                                    USDFC. If it falls below 110% (or 150% in
                                    Recovery Mode), liquidation may occur.
                                </div>
                                <p className='text-right font-bold'>
                                    {collateralRatio
                                        ? new Percent(
                                              collateralRatio
                                          ).prettify()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className='rounded-xl border border-neutral-9 bg-white p-6'>
                            <div className='flex items-start justify-between'>
                                <div className='max-w-[60%] text-sm text-gray-500'>
                                    <h3 className='mb-1 text-left text-sm font-bold text-gray-500'>
                                        New Liquidation Risk
                                    </h3>
                                    The risk of losing your FIL collateral if
                                    your Collateral Ratio drops below 110% under
                                    normal conditions or 150% in Recovery Mode.
                                </div>
                                <div
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${liquidationRisk.bg}`}
                                >
                                    <div
                                        className={`h-2 w-2 rounded-full ${liquidationRisk.dotBg}`}
                                    ></div>
                                    <span
                                        className={`text-xs ${liquidationRisk.color}`}
                                    >
                                        {liquidationRisk.text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-bold'>Total Debt</h3>
                            <div className='flex items-center gap-1'>
                                <span className='font-bold'>
                                    {totalDebt.prettify(DEBT_TOKEN_PRECISION)}
                                </span>
                                <USDFCIcon />
                                <span>USDFC</span>
                            </div>
                        </div>
                    </div>

                    {stableTroveChange ? (
                        <TroveAction
                            transactionId={TRANSACTION_ID}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                            className='mb-3 w-full rounded-xl bg-primary-500 py-3.5 font-medium text-white hover:bg-primary-500/90'
                        >
                            Update Trove
                        </TroveAction>
                    ) : (
                        <Button
                            disabled
                            className='mb-3 w-full rounded-xl bg-neutral-250 py-3.5 font-medium text-white'
                        >
                            Update Trove
                        </Button>
                    )}
                    <p className='mt-2 text-center text-sm text-gray-500'>
                        This action will open your wallet to sign the
                        transaction.
                    </p>
                </>
            ) : (
                <>
                    <p className='mb-6 text-left text-sm text-gray-500'>
                        Closing your Trove will repay all your debt and return
                        your remaining collateral.
                    </p>

                    <div className='mb-6'>
                        <InputBox
                            label='You will repay'
                            value={totalDebt.prettify(2)}
                            onChange={() => {}} // Read-only
                            tokenIcon={
                                <>
                                    <USDFCIconLarge />
                                    <span className='text-2xl font-medium leading-none'>
                                        USDFC
                                    </span>
                                </>
                            }
                            subLabel={`$${totalDebt.prettify()}`}
                            readOnly={true}
                            type='text'
                        />

                        <InputBox
                            label='You will reclaim'
                            value={collateral.prettify()}
                            onChange={() => {}} // Read-only
                            tokenIcon={
                                <>
                                    <FILIcon className='h-8 w-8' />
                                    <span className='text-2xl font-medium leading-none'>
                                        FIL
                                    </span>
                                </>
                            }
                            subLabel={`$${collateral
                                .mul(price)
                                .sub(fee)
                                .prettify()}`}
                            readOnly={true}
                            type='text'
                        />
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
                            className='text-lg w-full bg-primary-500 py-4 hover:bg-primary-700'
                        >
                            Repay & Close Trove
                        </Button>
                    )}
                    <p className='mt-2 text-center text-sm text-gray-500'>
                        This action will open your wallet to sign the
                        transaction.
                    </p>
                </>
            )}
        </>
    );
};
