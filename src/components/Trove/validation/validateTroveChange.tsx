import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    MINIMUM_COLLATERAL_RATIO,
    MINIMUM_DEBT,
    MINIMUM_NET_DEBT,
    Percent,
    SfStablecoinStoreState,
    Trove,
    TroveAdjustmentParams,
    TroveChange,
    TroveClosureParams,
    TroveCreationParams,
} from '@secured-finance/stablecoin-lib-base';
import { Alert } from 'src/components/atoms';
import { COIN, CURRENCY } from 'src/strings';
import { ActionDescription, Amount } from '../../ActionDescription';

const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);
const ccrPercent = new Percent(CRITICAL_COLLATERAL_RATIO).toString(0);

type TroveAdjustmentDescriptionParams = {
    params: TroveAdjustmentParams<Decimal>;
};

const TroveChangeDescription: React.FC<TroveAdjustmentDescriptionParams> = ({
    params,
}) => (
    <ActionDescription>
        {params.depositCollateral && params.borrowDebtToken ? (
            <>
                You will deposit{' '}
                <Amount>
                    {params.depositCollateral.prettify()} {CURRENCY}
                </Amount>{' '}
                and receive{' '}
                <Amount>
                    {params.borrowDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : params.repayDebtToken && params.withdrawCollateral ? (
            <>
                You will pay{' '}
                <Amount>
                    {params.repayDebtToken.prettify()} {COIN}
                </Amount>{' '}
                and receive{' '}
                <Amount>
                    {params.withdrawCollateral.prettify()} {CURRENCY}
                </Amount>
            </>
        ) : params.depositCollateral && params.repayDebtToken ? (
            <>
                You will deposit{' '}
                <Amount>
                    {params.depositCollateral.prettify()} {CURRENCY}
                </Amount>{' '}
                and pay{' '}
                <Amount>
                    {params.repayDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : params.borrowDebtToken && params.withdrawCollateral ? (
            <>
                You will receive{' '}
                <Amount>
                    {params.withdrawCollateral.prettify()} {CURRENCY}
                </Amount>{' '}
                and{' '}
                <Amount>
                    {params.borrowDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : params.depositCollateral ? (
            <>
                You will deposit{' '}
                <Amount>
                    {params.depositCollateral.prettify()} {CURRENCY}
                </Amount>
            </>
        ) : params.withdrawCollateral ? (
            <>
                You will receive{' '}
                <Amount>
                    {params.withdrawCollateral.prettify()} {CURRENCY}
                </Amount>
            </>
        ) : params.borrowDebtToken ? (
            <>
                You will receive{' '}
                <Amount>
                    {params.borrowDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : (
            <>
                You will pay{' '}
                <Amount>
                    {params.repayDebtToken.prettify()} {COIN}
                </Amount>
            </>
        )}
        .
    </ActionDescription>
);

export const selectForTroveChangeValidation = ({
    price,
    total,
    accountBalance,
    debtTokenBalance,
    numberOfTroves,
}: SfStablecoinStoreState) => ({
    price,
    total,
    accountBalance,
    debtTokenBalance,
    numberOfTroves,
});

type TroveChangeValidationSelectedState = ReturnType<
    typeof selectForTroveChangeValidation
>;

interface TroveChangeValidationContext
    extends TroveChangeValidationSelectedState {
    originalTrove: Trove;
    resultingTrove: Trove;
    recoveryMode: boolean;
    wouldTriggerRecoveryMode: boolean;
}

export const validateTroveChange = (
    originalTrove: Trove,
    adjustedTrove: Trove,
    borrowingRate: Decimal,
    selectedState: TroveChangeValidationSelectedState
): [
    validChange:
        | Exclude<TroveChange<Decimal>, { type: 'invalidCreation' }>
        | undefined,
    description: JSX.Element | undefined
] => {
    const { total, price } = selectedState;
    const change = originalTrove.whatChanged(adjustedTrove, borrowingRate);

    if (!change) {
        return [undefined, undefined];
    }

    // Reapply change to get the exact state the Trove will end up in (which could be slightly
    // different from `edited` due to imprecision).
    const resultingTrove = originalTrove.apply(change, borrowingRate);
    const recoveryMode = total.collateralRatioIsBelowCritical(price);
    const wouldTriggerRecoveryMode = total
        .subtract(originalTrove)
        .add(resultingTrove)
        .collateralRatioIsBelowCritical(price);

    const context: TroveChangeValidationContext = {
        ...selectedState,
        originalTrove,
        resultingTrove,
        recoveryMode,
        wouldTriggerRecoveryMode,
    };

    if (change.type === 'invalidCreation') {
        // Trying to create a Trove with negative net debt
        return [
            undefined,
            <Alert key={0}>
                Total debt must be at least{' '}
                <Amount>
                    {MINIMUM_DEBT.toString()} {COIN}
                </Amount>
                .
            </Alert>,
        ];
    }

    const errorDescription =
        change.type === 'creation'
            ? validateTroveCreation(change.params, context)
            : change.type === 'closure'
            ? validateTroveClosure(change.params, context)
            : validateTroveAdjustment(change.params, context);

    if (errorDescription) {
        return [undefined, errorDescription];
    }

    return [change, <TroveChangeDescription params={change.params} key={1} />];
};

const validateTroveCreation = (
    { depositCollateral, borrowDebtToken }: TroveCreationParams<Decimal>,
    {
        resultingTrove,
        recoveryMode,
        wouldTriggerRecoveryMode,
        accountBalance,
        price,
    }: TroveChangeValidationContext
): JSX.Element | null => {
    if (borrowDebtToken.lt(MINIMUM_NET_DEBT)) {
        return (
            <Alert>
                You must borrow at least{' '}
                <Amount>
                    {MINIMUM_NET_DEBT.toString()} {COIN}
                </Amount>
                .
            </Alert>
        );
    }

    if (recoveryMode) {
        if (!resultingTrove.isOpenableInRecoveryMode(price)) {
            return (
                <Alert>
                    You are not allowed to open a Trove with less than{' '}
                    <Amount>{ccrPercent}</Amount> Collateral Ratio during
                    recovery mode. Please increase your Troves Collateral Ratio.
                </Alert>
            );
        }
    } else {
        if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
            return (
                <Alert>
                    Collateral ratio must be at least{' '}
                    <Amount>{mcrPercent}</Amount>.
                </Alert>
            );
        }

        if (wouldTriggerRecoveryMode) {
            return (
                <Alert>
                    You are not allowed to open a Trove that would cause the
                    Total Collateral Ratio to fall below{' '}
                    <Amount>{ccrPercent}</Amount>. Please increase your Troves
                    Collateral Ratio.
                </Alert>
            );
        }
    }

    if (depositCollateral.gt(accountBalance)) {
        return (
            <Alert>
                The amount you are trying to deposit exceeds your balance by{' '}
                <Amount>
                    {`${depositCollateral
                        .sub(accountBalance)
                        .prettify()} ${CURRENCY}`}
                </Amount>
                .
            </Alert>
        );
    }

    return null;
};

const validateTroveAdjustment = (
    {
        depositCollateral,
        withdrawCollateral,
        borrowDebtToken,
        repayDebtToken,
    }: TroveAdjustmentParams<Decimal>,
    {
        originalTrove,
        resultingTrove,
        recoveryMode,
        wouldTriggerRecoveryMode,
        price,
        accountBalance,
        debtTokenBalance,
    }: TroveChangeValidationContext
): JSX.Element | null => {
    if (recoveryMode) {
        if (withdrawCollateral) {
            return (
                <Alert>
                    You are not allowed to withdraw collateral during recovery
                    mode.
                </Alert>
            );
        }

        if (borrowDebtToken) {
            if (resultingTrove.collateralRatioIsBelowCritical(price)) {
                return (
                    <Alert>
                        Your collateral ratio must be at least{' '}
                        <Amount>{ccrPercent}</Amount> to borrow during recovery
                        mode. Please improve your collateral ratio.
                    </Alert>
                );
            }

            if (
                resultingTrove
                    .collateralRatio(price)
                    .lt(originalTrove.collateralRatio(price))
            ) {
                return (
                    <Alert>
                        You are not allowed to decrease your collateral ratio
                        during recovery mode.
                    </Alert>
                );
            }
        }
    } else {
        if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
            return (
                <Alert>
                    Collateral ratio must be at least{' '}
                    <Amount>{mcrPercent}</Amount>.
                </Alert>
            );
        }

        if (wouldTriggerRecoveryMode) {
            return (
                <Alert>
                    The adjustment you are trying to make would cause the Total
                    Collateral Ratio to fall below <Amount>{ccrPercent}</Amount>
                    . Please increase your Troves Collateral Ratio.
                </Alert>
            );
        }
    }

    if (repayDebtToken) {
        if (resultingTrove.debt.lt(MINIMUM_DEBT)) {
            return (
                <Alert>
                    Total debt must be at least{' '}
                    <Amount>
                        {MINIMUM_DEBT.toString()} {COIN}
                    </Amount>
                    .
                </Alert>
            );
        }

        if (repayDebtToken.gt(debtTokenBalance)) {
            return (
                <Alert>
                    The amount you are trying to repay exceeds your balance by{' '}
                    <Amount>
                        {repayDebtToken.sub(debtTokenBalance).prettify()} {COIN}
                    </Amount>
                    .
                </Alert>
            );
        }
    }

    if (depositCollateral?.gt(accountBalance)) {
        return (
            <Alert>
                The amount you are trying to deposit exceeds your balance by{' '}
                <Amount>
                    {`${depositCollateral
                        .sub(accountBalance)
                        .prettify()} ${CURRENCY}`}
                </Amount>
                .
            </Alert>
        );
    }

    return null;
};

const validateTroveClosure = (
    { repayDebtToken }: TroveClosureParams<Decimal>,
    {
        recoveryMode,
        wouldTriggerRecoveryMode,
        numberOfTroves,
        debtTokenBalance,
    }: TroveChangeValidationContext
): JSX.Element | null => {
    if (numberOfTroves === 1) {
        return (
            <Alert>
                You are not allowed to close your Trove when there are no other
                Troves in the system.
            </Alert>
        );
    }

    if (recoveryMode) {
        return (
            <Alert>
                You are not allowed to close your Trove during recovery mode.
            </Alert>
        );
    }

    if (repayDebtToken?.gt(debtTokenBalance)) {
        return (
            <Alert>
                You only have{' '}
                <Amount>
                    {debtTokenBalance.prettify()} {COIN}
                </Amount>{' '}
                in your wallet. You need{' '}
                <Amount>
                    {repayDebtToken.sub(debtTokenBalance).prettify()} {COIN}
                </Amount>{' '}
                more to close your Trove.
            </Alert>
        );
    }

    if (wouldTriggerRecoveryMode) {
        return (
            <Alert>
                You are not allowed to close a Trove if it would cause the Total
                Collateralization Ratio to fall below{' '}
                <Amount>{ccrPercent}</Amount>. Please wait until the Total
                Collateral Ratio increases.
            </Alert>
        );
    }

    return null;
};
