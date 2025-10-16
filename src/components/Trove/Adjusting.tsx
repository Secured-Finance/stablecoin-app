import {
    Decimal,
    Difference,
    LIQUIDATION_RESERVE,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { useEffect, useRef, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { CURRENCY } from 'src/strings';
import {
    Button,
    ButtonSizes,
    InputBox,
    TabSwitcher,
} from 'src/components/atoms';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION, DEBT_TOKEN_PRECISION } from 'src/utils';
import { useStableTroveChange } from '../../hooks/useStableTroveChange';
import { USDFCIcon, USDFCIconLarge } from '../SecuredFinanceLogo';
import { useMyTransactionState } from '../Transaction';
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
    const [collateralInput, setCollateralInput] = useState<string>(
        trove.collateral.prettify(COLLATERAL_PRECISION)
    );
    const [netDebtInput, setNetDebtInput] = useState<string>(
        trove.netDebt.prettify(DEBT_TOKEN_PRECISION)
    );
    const [editingField, setEditingField] = useState<
        'collateral' | 'netDebt' | undefined
    >(undefined);
    const [isClosing, setIsClosing] = useState(false);

    const transactionState = useMyTransactionState(TRANSACTION_ID);
    const borrowingRate = fees.borrowingRate();

    // Calculate max collateral including current trove collateral + available account balance minus gas room
    const maxCollateral = trove.collateral.add(
        accountBalance.gt(GAS_ROOM_ETH)
            ? accountBalance.sub(GAS_ROOM_ETH)
            : Decimal.ZERO
    );

    useEffect(() => {
        if (transactionState.type === 'confirmedOneShot') {
            if (isClosing) {
                dispatchEvent('TROVE_CLOSED');
            } else {
                dispatchEvent('TROVE_ADJUSTED');
                setCollateral(trove.collateral);
                setNetDebt(trove.netDebt);
                setCollateralInput(
                    trove.collateral.prettify(COLLATERAL_PRECISION)
                );
                setNetDebtInput(trove.netDebt.prettify(DEBT_TOKEN_PRECISION));
                setEditingField(undefined);
            }
        }
    }, [transactionState.type, dispatchEvent, trove, isClosing]);

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
                setCollateralInput(
                    nextCollateral.prettify(COLLATERAL_PRECISION)
                );
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
                setNetDebtInput(nextNetDebt.prettify(DEBT_TOKEN_PRECISION));
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
    const repaymentAmount = totalDebt.sub(LIQUIDATION_RESERVE);
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
                text: 'Low',
                containerStyle: 'bg-success-50 border border-success-100',
                textStyle: 'text-success-700 text-sm font-medium',
                dotStyle: 'bg-success-500',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                containerStyle: 'bg-success-50 border border-success-100',
                textStyle: 'text-success-700 text-sm font-medium',
                dotStyle: 'bg-success-500',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                containerStyle: 'bg-success-50 border border-success-100',
                textStyle: 'text-success-700 text-sm font-medium',
                dotStyle: 'bg-success-500',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                containerStyle: 'bg-[#FFF7E0] border border-[#FFE4A3]',
                textStyle: 'text-warning-700 text-sm font-medium',
                dotStyle: 'bg-warning-500',
            };
        return {
            text: 'High',
            containerStyle: 'bg-[#FFE4E1] border border-[#FFACA3]',
            textStyle: 'text-error-700 text-sm font-medium',
            dotStyle: 'bg-error-500',
        };
    };

    const liquidationRisk = getLiquidationRisk(collateralRatio);

    // Update trove validation
    const [troveChange, description] = validateTroveChange(
        trove,
        updatedTrove,
        borrowingRate,
        validationContext
    );
    const stableTroveChange = useStableTroveChange(troveChange);

    // Close trove validation
    const closingTrove = new Trove(Decimal.ZERO, Decimal.ZERO);
    const [closeChange, closeDescription] = validateTroveChange(
        trove,
        closingTrove,
        borrowingRate,
        validationContext
    );
    const stableCloseChange = useStableTroveChange(closeChange);

    const handleTabChange = (tab: string) => {
        setIsClosing(tab === 'close');
        // Reset inputs to current trove state when switching tabs
        setCollateral(trove.collateral);
        setNetDebt(trove.netDebt);
        setCollateralInput(trove.collateral.prettify(COLLATERAL_PRECISION));
        setNetDebtInput(trove.netDebt.prettify(DEBT_TOKEN_PRECISION));
        setEditingField(undefined);
    };

    if (trove.status !== 'open') {
        return null;
    }

    return (
        <>
            <TabSwitcher
                activeTab={isClosing ? 'close' : 'update'}
                setActiveTab={handleTabChange}
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

                    <div className='mb-6 min-h-[40px]'>{description}</div>
                    <div className='mb-6'>
                        <InputBox
                            label='Collateral'
                            type='text'
                            value={collateralInput}
                            onFocus={() => setEditingField('collateral')}
                            onBlur={() => setEditingField(undefined)}
                            onChange={value => {
                                setCollateralInput(value);
                                const cleanValue =
                                    value?.replace(/,/g, '') || '0';
                                try {
                                    setCollateral(Decimal.from(cleanValue));
                                } catch {
                                    setCollateral(Decimal.ZERO);
                                }
                            }}
                            tokenIcon={
                                <>
                                    <FILIcon className='h-8 w-8' />
                                    <span className='text-5 font-medium leading-none tablet:text-6'>
                                        {CURRENCY}
                                    </span>
                                </>
                            }
                            subLabel={`$${collateral
                                .mul(price)
                                .prettify(COLLATERAL_PRECISION)}`}
                            maxValue={maxCollateral.prettify(
                                COLLATERAL_PRECISION
                            )}
                            maxToken={CURRENCY}
                            onMaxClick={() => {
                                setCollateral(maxCollateral);
                                setCollateralInput(
                                    maxCollateral.prettify(COLLATERAL_PRECISION)
                                );
                            }}
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus={true}
                        />

                        <InputBox
                            label='Borrowed Amount'
                            type='text'
                            value={netDebtInput}
                            onFocus={() => setEditingField('netDebt')}
                            onBlur={() => setEditingField(undefined)}
                            onChange={value => {
                                setNetDebtInput(value);
                                const cleanValue =
                                    value?.replace(/,/g, '') || '0';
                                try {
                                    setNetDebt(Decimal.from(cleanValue));
                                } catch {
                                    setNetDebt(Decimal.ZERO);
                                }
                            }}
                            tokenIcon={
                                <>
                                    <USDFCIconLarge />
                                    <span className='text-5 font-medium leading-none tablet:text-6'>
                                        USDFC
                                    </span>
                                </>
                            }
                            subLabel={`$${repaymentAmount.prettify(
                                DEBT_TOKEN_PRECISION
                            )}`}
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus={false}
                        />
                    </div>

                    <div className='mb-6 space-y-4'>
                        <div className='rounded-xl border border-neutral-9 bg-white p-6'>
                            <div className='flex items-start justify-between'>
                                <div className='max-w-[60%] text-sm text-gray-500'>
                                    <h3 className='mb-1 text-left text-sm font-bold text-gray-500'>
                                        New Collateral Ratio
                                    </h3>
                                    The ratio of deposited {CURRENCY} to
                                    borrowed USDFC. If it falls below 110% (or
                                    150% in Recovery Mode), liquidation may
                                    occur.
                                </div>
                                <p className='text-left font-bold tablet:text-right'>
                                    {collateralRatio
                                        ? `${collateralRatio
                                              .mul(100)
                                              .prettify(DEBT_TOKEN_PRECISION)}%`
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className='rounded-xl border border-neutral-9 bg-white p-6'>
                            <div className='flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-0'>
                                <div className='text-sm text-gray-500 tablet:max-w-[60%]'>
                                    <h3 className='mb-1 text-left text-sm font-bold text-gray-500'>
                                        New Liquidation Risk
                                    </h3>
                                    The risk of losing your {CURRENCY}{' '}
                                    collateral if your Collateral Ratio drops
                                    below 110% under normal conditions or 150%
                                    in Recovery Mode.
                                </div>
                                <div
                                    className={`inline-flex items-center rounded-full ${liquidationRisk.containerStyle}`}
                                    style={{
                                        padding: '6px 12px 6px 6px',
                                        gap: '6px',
                                    }}
                                >
                                    <div
                                        className={`rounded-full ${liquidationRisk.dotStyle}`}
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                        }}
                                    ></div>
                                    <span
                                        className={`${liquidationRisk.textStyle} whitespace-normal`}
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
                            size={ButtonSizes.xl}
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
                        By repaying from your wallet the amount equal to the
                        Total Debt minus the 20 USDFC covered by the Liquidation
                        Reserve, all debt will be settled, your collateral will
                        be returned, and your Trove will be closed. <br />{' '}
                        <br /> (e.g., If the Total Debt is 220 USDFC, 20 USDFC
                        is covered by the Liquidation Reserve and 200 USDFC is
                        repaid from your wallet){' '}
                    </p>

                    {closeDescription && (
                        <div className='mb-6'>{closeDescription}</div>
                    )}

                    <div className='mb-6'>
                        <InputBox
                            label='You will repay'
                            value={repaymentAmount.prettify(
                                DEBT_TOKEN_PRECISION
                            )}
                            onChange={() => {}} // Read-only
                            tokenIcon={
                                <>
                                    <USDFCIconLarge />
                                    <span className='text-lg font-medium leading-none laptop:text-2xl'>
                                        USDFC
                                    </span>
                                </>
                            }
                            subLabel={`$${repaymentAmount.prettify(
                                DEBT_TOKEN_PRECISION
                            )}`}
                            readOnly={true}
                            type='text'
                        />

                        <InputBox
                            label='You will reclaim'
                            value={collateral.prettify(COLLATERAL_PRECISION)}
                            onChange={() => {}} // Read-only
                            tokenIcon={
                                <>
                                    <FILIcon className='h-8 w-8' />
                                    <span className='text-lg font-medium leading-none laptop:text-2xl'>
                                        {CURRENCY}
                                    </span>
                                </>
                            }
                            subLabel={`$${collateral
                                .mul(price)
                                .sub(fee)
                                .prettify(COLLATERAL_PRECISION)}`}
                            readOnly={true}
                            type='text'
                        />
                    </div>

                    {stableCloseChange ? (
                        <TroveAction
                            transactionId={'closure'}
                            change={stableCloseChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                            className='w-full rounded-lg bg-primary-500 py-4 text-lg hover:bg-primary-700'
                        >
                            Repay & Close Trove
                        </TroveAction>
                    ) : (
                        <Button
                            disabled
                            className='w-full bg-primary-500 py-4 text-lg hover:bg-primary-700 disabled:cursor-default disabled:bg-gray-400 disabled:opacity-50'
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
