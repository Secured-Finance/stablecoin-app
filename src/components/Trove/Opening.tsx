/** @jsxImportSource theme-ui */
import {
    Decimal,
    LIQUIDATION_RESERVE,
    MINIMUM_NET_DEBT,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector, useStableTroveChange } from 'src/hooks';
import { COLLATERAL_PRECISION, DEBT_TOKEN_PRECISION } from 'src/utils';
import { Card, Spinner } from 'theme-ui';
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
    const { fees, price, accountBalance } = state;
    return {
        fees,
        price,
        accountBalance,
        validationContext: selectForTroveChangeValidation(state),
    };
};

const EMPTY_TROVE = new Trove(Decimal.ZERO, Decimal.ZERO);
const TRANSACTION_ID = 'trove-creation';
const GAS_ROOM_ETH = Decimal.from(0.1);

export const Opening: React.FC = () => {
    const { dispatchEvent } = useTroveView();
    const { fees, price, accountBalance, validationContext } =
        useSfStablecoinSelector(selector);
    const borrowingRate = fees.borrowingRate();
    const editingState = useState<string>();

    const [collateral, setCollateral] = useState<Decimal>(Decimal.ZERO);
    const [borrowAmount, setBorrowAmount] = useState<Decimal>(Decimal.ZERO);

    const maxBorrowingRate = borrowingRate.add(0.005);

    const fee = borrowAmount.mul(borrowingRate);
    const borrowRate = borrowingRate.prettify(4);
    const feePct = new Percent(borrowingRate);
    const totalDebt = borrowAmount.add(LIQUIDATION_RESERVE).add(fee);
    const isDirty = !collateral.isZero || !borrowAmount.isZero;
    const trove = isDirty ? new Trove(collateral, totalDebt) : EMPTY_TROVE;
    const maxCollateral = accountBalance.gt(GAS_ROOM_ETH)
        ? accountBalance.sub(GAS_ROOM_ETH)
        : Decimal.ZERO;
    const collateralMaxedOut = collateral.eq(maxCollateral);
    const collateralRatio =
        !collateral.isZero && !borrowAmount.isZero
            ? trove.collateralRatio(price)
            : undefined;

    const [troveChange, description] = validateTroveChange(
        EMPTY_TROVE,
        trove,
        borrowingRate,
        validationContext
    );

    const stableTroveChange = useStableTroveChange(troveChange);
    const [gasEstimationState, setGasEstimationState] =
        useState<GasEstimationState>({ type: 'idle' });

    const transactionState = useMyTransactionState(TRANSACTION_ID);
    const isTransactionPending =
        transactionState.type === 'waitingForApproval' ||
        transactionState.type === 'waitingForConfirmation';

    const handleCancelPressed = useCallback(() => {
        dispatchEvent('CANCEL_ADJUST_TROVE_PRESSED');
    }, [dispatchEvent]);

    const reset = useCallback(() => {
        setCollateral(Decimal.ZERO);
        setBorrowAmount(Decimal.ZERO);
    }, []);

    const setCollateralAmount = useCallback((amount: string) => {
        setCollateral(Decimal.from(amount));
    }, []);

    useEffect(() => {
        if (!collateral.isZero) {
            const stableDebt = collateral.mul(price).mulDiv(2, 3); // for 150% CR

            const allowedDebt = stableDebt.gt(LIQUIDATION_RESERVE)
                ? stableDebt
                      .sub(LIQUIDATION_RESERVE)
                      .div(Decimal.ONE.add(borrowRate))
                : Decimal.ZERO;

            setBorrowAmount(
                allowedDebt.gt(MINIMUM_NET_DEBT)
                    ? allowedDebt
                    : MINIMUM_NET_DEBT
            );
        }
    }, [borrowRate, collateral, price]);

    return (
        <CardComponent
            title={
                <>
                    Trove
                    {isDirty && !isTransactionPending && (
                        <button
                            className='hover:enabled:text-error-700'
                            onClick={reset}
                        >
                            <Icon name='history' size='lg' />
                        </button>
                    )}
                </>
            }
            actionComponent={
                <>
                    <Button
                        onClick={handleCancelPressed}
                        variant={ButtonVariants.tertiary}
                    >
                        {t('common.cancel')}
                    </Button>

                    {gasEstimationState.type === 'inProgress' ? (
                        <Button disabled>
                            <Spinner size={24} sx={{ color: 'background' }} />
                        </Button>
                    ) : stableTroveChange ? (
                        <TroveAction
                            transactionId={TRANSACTION_ID}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                        >
                            {t('common.confirm')}
                        </TroveAction>
                    ) : (
                        <Button variant={ButtonVariants.secondary} disabled>
                            {t('common.confirm')}
                        </Button>
                    )}
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <EditableRow
                    label={t('common.collateral')}
                    inputId='trove-collateral'
                    amount={collateral.prettify(COLLATERAL_PRECISION)}
                    maxAmount={maxCollateral.toString()}
                    maxedOut={collateralMaxedOut}
                    editingState={editingState}
                    unit='tFIL'
                    editedAmount={collateral.toString(COLLATERAL_PRECISION)}
                    setEditedAmount={setCollateralAmount}
                />

                <EditableRow
                    label={t('common.borrow')}
                    inputId='trove-borrow-amount'
                    amount={borrowAmount.prettify()}
                    unit={COIN}
                    editingState={editingState}
                    editedAmount={borrowAmount.toString(2)}
                    setEditedAmount={(amount: string) =>
                        setBorrowAmount(Decimal.from(amount))
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
                        amount={totalDebt.prettify(DEBT_TOKEN_PRECISION)}
                        unit={COIN}
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '240px' }}
                                    >
                                        {t('tooltips.total-debt')}{' '}
                                        {isDirty && (
                                            <>
                                                {t(
                                                    'card-component.need-to-repay'
                                                )}{' '}
                                                {totalDebt
                                                    .sub(LIQUIDATION_RESERVE)
                                                    .prettify(
                                                        DEBT_TOKEN_PRECISION
                                                    )}{' '}
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

                <CollateralRatio value={collateralRatio} />

                {/* <InfoBubble>
                    Keep your collateral ratio above the{' '}
                    <NavLink
                        to='/risky-troves'
                        className='font-semibold text-primary-500'
                    >
                        {t('common.riskiest-troves')}
                    </NavLink>{' '}
                    to avoid being{' '}
                    <LearnMoreLink link='https://docs.secured.finance/stablecoin-protocol-guide/key-features/redemption'>
                        {t('common.redeemed')}
                    </LearnMoreLink>
                </InfoBubble> */}

                <CollateralRatioInfoBubble value={collateralRatio} />

                {description ?? (
                    <InfoBubble>
                        {t('card-component.start-deposit-instruction')}
                    </InfoBubble>
                )}

                <ExpensiveTroveChangeWarning
                    troveChange={stableTroveChange}
                    maxBorrowingRate={maxBorrowingRate}
                    borrowingFeeDecayToleranceMinutes={60}
                    gasEstimationState={gasEstimationState}
                    setGasEstimationState={setGasEstimationState}
                />
                {isTransactionPending && <LoadingOverlay />}
            </div>
        </CardComponent>
    );
};
