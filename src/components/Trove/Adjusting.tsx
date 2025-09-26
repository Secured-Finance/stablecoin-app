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
import { CURRENCY } from 'src/strings';
import { Button, InputBox, TabSwitcher } from 'src/components/atoms';
import { useSfStablecoinSelector } from 'src/hooks';
import { DEBT_TOKEN_PRECISION } from 'src/utils';
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
        trove.collateral.prettify()
    );
    const [netDebtInput, setNetDebtInput] = useState<string>(
        trove.netDebt.prettify()
    );
    const [editingField, setEditingField] = useState<
        'collateral' | 'netDebt' | undefined
    >(undefined);
    const [isClosing, setIsClosing] = useState(false);
    const [hasAttemptedClose, setHasAttemptedClose] = useState(false);

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
                setCollateralInput(trove.collateral.prettify());
                setNetDebtInput(trove.netDebt.prettify());
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
                containerStyle: 'bg-[#F5F5F5] border border-[#D9D9D9]',
                textStyle: 'text-[#666666] text-sm font-medium',
                dotStyle: 'bg-[#999999]',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                containerStyle: 'bg-[#FFF7E0] border border-[#FFE4A3]',
                textStyle: 'text-[#5C2E00] text-sm font-medium',
                dotStyle: 'bg-[#FFAD00]',
            };
        return {
            text: 'High',
            containerStyle: 'bg-[#FFE4E1] border border-[#FFACA3]',
            textStyle: 'text-[#5C0000] text-sm font-medium',
            dotStyle: 'bg-[#FF4D4F]',
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

    const shouldShowCloseValidation = isClosing && hasAttemptedClose;
    const closeValidationError = shouldShowCloseValidation
        ? closeDescription
        : null;

    const handleTabChange = (tab: string) => {
        setIsClosing(tab === 'close');
        setHasAttemptedClose(false);
        // Reset inputs to current trove state when switching tabs
        setCollateral(trove.collateral);
        setNetDebt(trove.netDebt);
        setCollateralInput(trove.collateral.prettify());
        setNetDebtInput(trove.netDebt.prettify());
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
                    {description && !isClosing && (
                        <div className='pb-6'>{description}</div>
                    )}
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
                                    <span className='text-2xl font-medium leading-none'>
                                        {CURRENCY}
                                    </span>
                                </>
                            }
                            subLabel={`$${collateral.mul(price).prettify()}`}
                            maxValue={maxCollateral.prettify()}
                            maxToken={CURRENCY}
                            onMaxClick={() => {
                                setCollateral(maxCollateral);
                                setCollateralInput(maxCollateral.prettify());
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
                                    <span className='text-2xl font-medium leading-none'>
                                        USDFC
                                    </span>
                                </>
                            }
                            subLabel={`$${totalDebt.prettify()}`}
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
                                    The risk of losing your {CURRENCY}{' '}
                                    collateral if your Collateral Ratio drops
                                    below 110% under normal conditions or 150%
                                    in Recovery Mode.
                                </div>
                                <div
                                    className={`inline-flex items-center rounded-full ${liquidationRisk.containerStyle}`}
                                    style={{ padding: '6px 12px 6px 6px', gap: '6px' }}
                                >
                                    <div
                                        className={`rounded-full ${liquidationRisk.dotStyle}`}
                                        style={{ width: '16px', height: '16px' }}
                                    ></div>
                                    <span className={liquidationRisk.textStyle}>
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
                                        {CURRENCY}
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

                    {stableCloseChange && hasAttemptedClose ? (
                        <TroveAction
                            transactionId={'closure'}
                            change={stableCloseChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                        >
                            Repay & Close Trove
                        </TroveAction>
                    ) : hasAttemptedClose && !stableCloseChange ? (
                        <Button
                            disabled
                            className='text-lg w-full cursor-not-allowed bg-gray-400 py-4 opacity-50'
                        >
                            Repay & Close Trove
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setHasAttemptedClose(true)}
                            className='text-lg w-full bg-primary-500 py-4 hover:bg-primary-700'
                        >
                            Repay & Close Trove
                        </Button>
                    )}
                    {closeValidationError && (
                        <div className='py-2'>{closeValidationError}</div>
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
