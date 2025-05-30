/** @jsxImportSource theme-ui */
import {
    Decimal,
    LIQUIDATION_RESERVE,
    MINIMUM_NET_DEBT,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Alert, Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { DOCUMENTATION_LINKS } from 'src/constants';
import { useSfStablecoinSelector, useStableTroveChange } from 'src/hooks';
import { COLLATERAL_PRECISION, DEBT_TOKEN_PRECISION } from 'src/utils';
import { Card, Spinner } from 'theme-ui';
import { COIN, CURRENCY } from '../../strings';
import { Icon } from '../Icon';
import { InfoIcon } from '../InfoIcon';
import { LoadingOverlay } from '../LoadingOverlay';
import { LearnMoreLink } from '../Tooltip';
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
import { Amount } from '../ActionDescription';

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

    const collateralExceedsMax =
        collateral.gt(maxCollateral) && collateral.eq(accountBalance);

    useEffect(() => {
        if (collateralExceedsMax) {
            setBorrowAmount(Decimal.ZERO);
            return;
        }
        if (!collateral.isZero) {
            const stableDebt = collateral.mul(price).mulDiv(2, 3); // for 150% CR

            const allowedDebt = stableDebt.gt(LIQUIDATION_RESERVE)
                ? stableDebt
                      .sub(LIQUIDATION_RESERVE)
                      .div(Decimal.ONE.add(borrowRate))
                : Decimal.ZERO;

            const safeBorrowable = allowedDebt.gt(MINIMUM_NET_DEBT)
                ? allowedDebt
                : MINIMUM_NET_DEBT;

            const borrowableAfterGasBuffer = safeBorrowable.sub(
                Decimal.from(0.01)
            );

            setBorrowAmount(
                borrowableAfterGasBuffer.gt(Decimal.ZERO)
                    ? borrowableAfterGasBuffer
                    : Decimal.ZERO
            );
        }
    }, [borrowRate, collateral, collateralExceedsMax, price]);

    return (
        <CardComponent
            title={
                <>
                    Trove
                    {isDirty && !isTransactionPending && (
                        <button
                            className='item-right flex w-8 w-auto items-center px-2 hover:enabled:text-error-700'
                            onClick={reset}
                        >
                            <span className='typography-mobile-body-4 pr-1 font-semibold'>
                                Reset
                            </span>
                            <Icon name='history' size='sm' />
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
                        Cancel
                    </Button>

                    {gasEstimationState.type === 'inProgress' ? (
                        <Button disabled>
                            <Spinner size={24} sx={{ color: 'background' }} />
                        </Button>
                    ) : collateralExceedsMax ? (
                        <Button disabled>Exceeds Max collateral</Button>
                    ) : stableTroveChange ? (
                        <TroveAction
                            transactionId={TRANSACTION_ID}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            borrowingFeeDecayToleranceMinutes={60}
                        >
                            Confirm
                        </TroveAction>
                    ) : (
                        <Button disabled>Confirm</Button>
                    )}
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <EditableRow
                    label='Collateral'
                    inputId='trove-collateral'
                    amount={collateral.prettify(COLLATERAL_PRECISION)}
                    maxAmount={maxCollateral.toString()}
                    maxedOut={collateralMaxedOut}
                    editingState={editingState}
                    unit={CURRENCY}
                    editedAmount={collateral.toString(COLLATERAL_PRECISION)}
                    setEditedAmount={setCollateralAmount}
                />

                <EditableRow
                    label='Borrow'
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
                        label='Liquidation Reserve'
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
                                        An amount set aside to cover the
                                        liquidator’s gas costs if your Trove
                                        needs to be liquidated. The amount
                                        increases your debt and is refunded if
                                        you close your Trove by fully paying off
                                        its net debt.
                                    </Card>
                                }
                            />
                        }
                    />

                    <StaticRow
                        label='Borrowing Fee'
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
                                        This amount is deducted from the
                                        borrowed amount as a one-time fee. There
                                        are no recurring fees for borrowing,
                                        which is thus interest-free.
                                    </Card>
                                }
                            />
                        }
                    />

                    <StaticRow
                        label='Total debt'
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
                                        {`The total amount of ${COIN} your Trove will hold.`}
                                        {isDirty && (
                                            <>
                                                {` You will need to repay ${totalDebt
                                                    .sub(LIQUIDATION_RESERVE)
                                                    .prettify(
                                                        DEBT_TOKEN_PRECISION
                                                    )} ${COIN} to reclaim your collateral (${LIQUIDATION_RESERVE.toString()} ${COIN} Liquidation Reserve excluded.)`}
                                            </>
                                        )}
                                    </Card>
                                }
                            />
                        }
                    />
                </div>

                <CollateralRatio value={collateralRatio} />

                <Alert color='info'>
                    Keep your collateral ratio above the{' '}
                    <NavLink
                        to='/risky-troves'
                        className='font-semibold text-primary-500'
                    >
                        riskiest Troves
                    </NavLink>{' '}
                    to avoid being{' '}
                    <LearnMoreLink link={DOCUMENTATION_LINKS.redemption}>
                        redeemed.
                    </LearnMoreLink>
                </Alert>

                <CollateralRatioInfoBubble value={collateralRatio} />

                {!collateralExceedsMax &&
                    (description ?? (
                        <Alert color='info'>
                            Start by entering the amount of {CURRENCY} you would
                            like to deposit as collateral.
                        </Alert>
                    ))}

                {collateralExceedsMax && (
                    <Alert>
                        The amount you are trying to deposit exceeds your
                        balance after transaction fees by{' '}
                        <Amount>
                            {collateral.sub(maxCollateral).prettify()}{' '}
                            {CURRENCY}.
                        </Amount>
                    </Alert>
                )}

                {!collateralExceedsMax && (
                    <ExpensiveTroveChangeWarning
                        troveChange={stableTroveChange}
                        maxBorrowingRate={maxBorrowingRate}
                        borrowingFeeDecayToleranceMinutes={60}
                        gasEstimationState={gasEstimationState}
                        setGasEstimationState={setGasEstimationState}
                    />
                )}
                {isTransactionPending && <LoadingOverlay />}
            </div>
        </CardComponent>
    );
};
