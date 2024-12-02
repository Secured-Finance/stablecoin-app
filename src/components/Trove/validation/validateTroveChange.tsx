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
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import { COIN } from '../../../strings';
import { ActionDescription, Amount } from '../../ActionDescription';
import { ErrorDescription } from '../../ErrorDescription';

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
                {t('common.you-will')} {t('common.deposit')}{' '}
                <Amount>{params.depositCollateral.prettify()} tFIL</Amount>{' '}
                {t('common.and')}
                {t('common.receive')}{' '}
                <Amount>
                    {params.borrowDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : params.repayDebtToken && params.withdrawCollateral ? (
            <>
                {t('common.you-will')} {t('common.pay')}{' '}
                <Amount>
                    {params.repayDebtToken.prettify()} {COIN}
                </Amount>{' '}
                {t('common.and')} {t('common.receive')}{' '}
                <Amount>{params.withdrawCollateral.prettify()} tFIL</Amount>
            </>
        ) : params.depositCollateral && params.repayDebtToken ? (
            <>
                {t('common.you-will')} {t('common.deposit')}{' '}
                <Amount>{params.depositCollateral.prettify()} tFIL</Amount>{' '}
                {t('common.and')}
                {t('common.pay')}{' '}
                <Amount>
                    {params.repayDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : params.borrowDebtToken && params.withdrawCollateral ? (
            <>
                {t('common.you-will')} {t('common.receive')}{' '}
                <Amount>{params.withdrawCollateral.prettify()} tFIL</Amount>{' '}
                {t('common.and')}{' '}
                <Amount>
                    {params.borrowDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : params.depositCollateral ? (
            <>
                {t('common.you-will')} {t('common.deposit')}{' '}
                <Amount>{params.depositCollateral.prettify()} tFIL</Amount>
            </>
        ) : params.withdrawCollateral ? (
            <>
                {t('common.you-will')} {t('common.receive')}{' '}
                <Amount>{params.withdrawCollateral.prettify()} tFIL</Amount>
            </>
        ) : params.borrowDebtToken ? (
            <>
                {t('common.you-will')} {t('common.receive')}{' '}
                <Amount>
                    {params.borrowDebtToken.prettify()} {COIN}
                </Amount>
            </>
        ) : (
            <>
                {t('common.you-will')} {t('common.deposit')}{' '}
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
            <ErrorDescription key={0}>
                {t('common.total-debt-notice', {
                    COIN,
                    AMOUNT: MINIMUM_DEBT.toString(),
                })}
            </ErrorDescription>,
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
            <ErrorDescription>
                {t('common.min-borrow-notice', {
                    COIN,
                    AMOUNT: MINIMUM_NET_DEBT.toString(),
                })}
            </ErrorDescription>
        );
    }

    if (recoveryMode) {
        if (!resultingTrove.isOpenableInRecoveryMode(price)) {
            return (
                <ErrorDescription>
                    {t('card-component.increase-collateral-ratio', {
                        PERCENT: ccrPercent,
                    })}
                </ErrorDescription>
            );
        }
    } else {
        if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
            return (
                <ErrorDescription>
                    {t('card-component.collateral-warning', {
                        AMOUNT: mcrPercent,
                    })}
                </ErrorDescription>
            );
        }

        if (wouldTriggerRecoveryMode) {
            return (
                <ErrorDescription>
                    {t('card-component.increase-coll-ratio', {
                        PERCENT: ccrPercent,
                    })}
                </ErrorDescription>
            );
        }
    }

    if (depositCollateral.gt(accountBalance)) {
        return (
            <ErrorDescription>
                {t('common.exceeds-balance-limit', {
                    COIN: 'tFIL',
                    AMOUNT: depositCollateral.sub(accountBalance).prettify(),
                })}
            </ErrorDescription>
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
                <ErrorDescription>
                    {t('common.withdrawal-disabled')}
                </ErrorDescription>
            );
        }

        if (borrowDebtToken) {
            if (resultingTrove.collateralRatioIsBelowCritical(price)) {
                return (
                    <ErrorDescription>
                        {t('common.minimum-collateral-ratio-required', {
                            PERCENT: ccrPercent,
                        })}
                    </ErrorDescription>
                );
            }

            if (
                resultingTrove
                    .collateralRatio(price)
                    .lt(originalTrove.collateralRatio(price))
            ) {
                return (
                    <ErrorDescription>
                        {t('common.restrict-collateral-ratio')}
                    </ErrorDescription>
                );
            }
        }
    } else {
        if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
            return (
                <ErrorDescription>
                    {t('card-component.collateral-warning', {
                        AMOUNT: mcrPercent,
                    })}
                </ErrorDescription>
            );
        }

        if (wouldTriggerRecoveryMode) {
            return (
                <ErrorDescription>
                    {t('common.total-collateral-ratio-breach', {
                        AMOUNT: ccrPercent,
                    })}
                </ErrorDescription>
            );
        }
    }

    if (repayDebtToken) {
        if (resultingTrove.debt.lt(MINIMUM_DEBT)) {
            return (
                <ErrorDescription>
                    {t('common.total-debt-notice', {
                        COIN,
                        AMOUNT: MINIMUM_DEBT.toString(),
                    })}
                </ErrorDescription>
            );
        }

        if (repayDebtToken.gt(debtTokenBalance)) {
            return (
                <ErrorDescription>
                    {t('card-component.repay-exceed', {
                        AMOUNT: repayDebtToken.sub(debtTokenBalance).prettify(),
                        COIN,
                    })}
                </ErrorDescription>
            );
        }
    }

    if (depositCollateral?.gt(accountBalance)) {
        return (
            <ErrorDescription>
                {t('card-component.repay-exceed', {
                    AMOUNT: depositCollateral.sub(debtTokenBalance).prettify(),
                    COIN: 'tFIL',
                })}
            </ErrorDescription>
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
            <ErrorDescription>
                {t('card-component.no-other-troves')}
            </ErrorDescription>
        );
    }

    if (recoveryMode) {
        return (
            <ErrorDescription>
                {t('card-component.recovery-mode-trove')}
            </ErrorDescription>
        );
    }

    if (repayDebtToken?.gt(debtTokenBalance)) {
        return (
            <ErrorDescription>
                {t('stablecoin-stats.close-trove-alert', {
                    COIN,
                    AMOUNT: repayDebtToken.sub(debtTokenBalance).prettify(),
                })}
            </ErrorDescription>
        );
    }

    if (wouldTriggerRecoveryMode) {
        return (
            <ErrorDescription>
                {t('card-component.trigger-recovery-mode', {
                    PERCENT: ccrPercent,
                })}
            </ErrorDescription>
        );
    }

    return null;
};
