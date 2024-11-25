import {
    Decimal,
    Difference,
    LIQUIDATION_RESERVE,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { Card } from 'theme-ui';
import { useStableTroveChange } from '../../hooks/useStableTroveChange';
import { COIN } from '../../strings';
import { Icon } from '../Icon';
import { InfoBubble } from '../InfoBubble';
import { InfoIcon } from '../InfoIcon';
import { LoadingOverlay } from '../LoadingOverlay';
import { useMyTransactionState } from '../Transaction';
import { CollateralRatio, CollateralRatioInfoBubble } from './CollateralRatio';
import { EditableRow, StaticRow } from './Editor';
import {
    ExpensiveTroveChangeWarning,
    GasEstimationState,
} from './ExpensiveTroveChangeWarning';
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
    const editingState = useState<string>();
    const previousTrove = useRef<Trove>(trove);
    const [collateral, setCollateral] = useState<Decimal>(trove.collateral);
    const [netDebt, setNetDebt] = useState<Decimal>(trove.netDebt);

    const transactionState = useMyTransactionState(TRANSACTION_ID);
    const borrowingRate = fees.borrowingRate();

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

    const handleCancelPressed = useCallback(() => {
        dispatchEvent('CANCEL_ADJUST_TROVE_PRESSED');
    }, [dispatchEvent]);

    const reset = useCallback(() => {
        setCollateral(trove.collateral);
        setNetDebt(trove.netDebt);
    }, [trove.collateral, trove.netDebt]);

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
    const feePct = new Percent(borrowingRate);
    const availableEth = accountBalance.gt(GAS_ROOM_ETH)
        ? accountBalance.sub(GAS_ROOM_ETH)
        : Decimal.ZERO;
    const maxCollateral = trove.collateral.add(availableEth);
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
    const [gasEstimationState, setGasEstimationState] =
        useState<GasEstimationState>({ type: 'idle' });

    const isTransactionPending =
        transactionState.type === 'waitingForApproval' ||
        transactionState.type === 'waitingForConfirmation';

    if (trove.status !== 'open') {
        return null;
    }

    return (
        <CardComponent
            title={
                <>
                    Trove
                    {isDirty && !isTransactionPending && (
                        <button
                            onClick={reset}
                            className='hover:enabled:text-error-700'
                        >
                            <Icon name='history' size='lg' />
                        </button>
                    )}
                </>
            }
            actionComponent={
                <>
                    <Button
                        variant={ButtonVariants.tertiary}
                        onClick={handleCancelPressed}
                    >
                        {t('common.cancel')}
                    </Button>

                    {stableTroveChange ? (
                        <TroveAction
                            transactionId={TRANSACTION_ID}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                        >
                            {t('common.confirm')}
                        </TroveAction>
                    ) : (
                        <Button disabled>{t('common.confirm')}</Button>
                    )}
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <EditableRow
                    label={t('common.collateral')}
                    inputId='trove-collateral'
                    amount={collateral.prettify(4)}
                    maxAmount={maxCollateral.toString()}
                    maxedOut={collateralMaxedOut}
                    editingState={editingState}
                    unit='tFIL'
                    editedAmount={collateral.toString(4)}
                    setEditedAmount={(amount: string) =>
                        setCollateral(Decimal.from(amount))
                    }
                />

                <EditableRow
                    label={t('common.net-debt')}
                    inputId='trove-net-debt-amount'
                    amount={netDebt.prettify()}
                    unit={COIN}
                    editingState={editingState}
                    editedAmount={netDebt.toString(2)}
                    setEditedAmount={(amount: string) =>
                        setNetDebt(Decimal.from(amount))
                    }
                />

                <div className='flex flex-col gap-3 px-3'>
                    <StaticRow
                        label={t('common.liquidation-reserve')}
                        inputId='trove-liquidation-reserve'
                        amount={`${LIQUIDATION_RESERVE}`}
                        unit={COIN}
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '200px' }}
                                    >
                                        {t('tooltips.liquidation-reserve')}
                                    </Card>
                                }
                            />
                        }
                    />

                    <StaticRow
                        label={t('common.borrowing-fee')}
                        inputId='trove-borrowing-fee'
                        amount={fee.prettify(2)}
                        pendingAmount={feePct.toString(2)}
                        unit={COIN}
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '240px' }}
                                    >
                                        {t('tooltips.borrowing-fee')}
                                    </Card>
                                }
                            />
                        }
                    />

                    <StaticRow
                        label={t('common.total-debt')}
                        inputId='trove-total-debt'
                        amount={totalDebt.prettify(2)}
                        unit={COIN}
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '240px' }}
                                    >
                                        {t('card-component.total-hold')}{' '}
                                        {isDirty && (
                                            <>
                                                {t(
                                                    'card-component.need-to-repay'
                                                )}{' '}
                                                {totalDebt
                                                    .sub(LIQUIDATION_RESERVE)
                                                    .prettify(2)}{' '}
                                                {t(
                                                    'card-component.to-reclaim-collateral'
                                                )}
                                                (
                                                {LIQUIDATION_RESERVE.toString()}{' '}
                                                {t(
                                                    'card-component.reserve-excluded'
                                                )}
                                                ).
                                            </>
                                        )}
                                    </Card>
                                }
                            />
                        }
                    />
                </div>

                <CollateralRatio
                    value={collateralRatio}
                    change={collateralRatioChange}
                />
                <CollateralRatioInfoBubble value={collateralRatio} />

                {description ?? (
                    <InfoBubble>
                        {t('card-component.adjust-trove-desc')}
                    </InfoBubble>
                )}

                <ExpensiveTroveChangeWarning
                    troveChange={stableTroveChange}
                    maxBorrowingRate={maxBorrowingRate}
                    borrowingFeeDecayToleranceMinutes={60}
                    gasEstimationState={gasEstimationState}
                    setGasEstimationState={setGasEstimationState}
                />
            </div>
            {isTransactionPending && <LoadingOverlay />}
        </CardComponent>
    );
};
