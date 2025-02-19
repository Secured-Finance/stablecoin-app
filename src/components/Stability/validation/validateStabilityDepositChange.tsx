import {
    Decimal,
    SfStablecoinStoreState,
    StabilityDeposit,
    StabilityDepositChange,
} from '@secured-finance/stablecoin-lib-base';
import { Alert } from 'src/components/atoms';
import { COIN } from '../../../strings';
import { Amount } from '../../ActionDescription';
import { StabilityActionDescription } from '../StabilityActionDescription';

export const selectForStabilityDepositChangeValidation = ({
    trove,
    debtTokenBalance,
    ownFrontend,
    haveUndercollateralizedTroves,
}: SfStablecoinStoreState) => ({
    trove,
    debtTokenBalance,
    haveOwnFrontend: ownFrontend.status === 'registered',
    haveUndercollateralizedTroves,
});

type StabilityDepositChangeValidationContext = ReturnType<
    typeof selectForStabilityDepositChangeValidation
>;

export const validateStabilityDepositChange = (
    originalDeposit: StabilityDeposit,
    editedDebtToken: Decimal,
    {
        debtTokenBalance,
        haveOwnFrontend,
        haveUndercollateralizedTroves,
    }: StabilityDepositChangeValidationContext
): [
    validChange: StabilityDepositChange<Decimal> | undefined,
    description: JSX.Element | undefined
] => {
    const change = originalDeposit.whatChanged(editedDebtToken);

    if (haveOwnFrontend) {
        return [
            undefined,
            <Alert key={0}>
                You can’t deposit using a wallet address that is registered as a
                frontend.
            </Alert>,
        ];
    }

    if (!change) {
        return [undefined, undefined];
    }

    if (change.depositDebtToken?.gt(debtTokenBalance)) {
        return [
            undefined,
            <Alert key={1}>
                The amount you are trying to deposit exceeds your balance by{' '}
                <Amount>
                    {change.depositDebtToken.sub(debtTokenBalance).prettify()}{' '}
                    {COIN}
                </Amount>
                .
            </Alert>,
        ];
    }

    if (change.withdrawDebtToken && haveUndercollateralizedTroves) {
        return [
            undefined,
            <Alert key={2}>
                You are not allowed to withdraw {COIN} from your Stability
                Deposit when there are undercollateralized Troves. Please
                liquidate those Troves or try again later.
            </Alert>,
        ];
    }

    return [
        change,
        <StabilityActionDescription
            originalDeposit={originalDeposit}
            change={change}
            key={3}
        />,
    ];
};
