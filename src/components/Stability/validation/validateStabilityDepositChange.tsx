import {
    Decimal,
    LiquityStoreState,
    StabilityDeposit,
    StabilityDepositChange,
} from '@secured-finance/lib-base';

import { COIN } from '../../../strings';
import { Amount } from '../../ActionDescription';
import { ErrorDescription } from '../../ErrorDescription';
import { StabilityActionDescription } from '../StabilityActionDescription';

export const selectForStabilityDepositChangeValidation = ({
    trove,
    lusdBalance,
    ownFrontend,
    haveUndercollateralizedTroves,
}: LiquityStoreState) => ({
    trove,
    lusdBalance,
    haveOwnFrontend: ownFrontend.status === 'registered',
    haveUndercollateralizedTroves,
});

type StabilityDepositChangeValidationContext = ReturnType<
    typeof selectForStabilityDepositChangeValidation
>;

export const validateStabilityDepositChange = (
    originalDeposit: StabilityDeposit,
    editedLUSD: Decimal,
    {
        lusdBalance,
        haveOwnFrontend,
        haveUndercollateralizedTroves,
    }: StabilityDepositChangeValidationContext
): [
    validChange: StabilityDepositChange<Decimal> | undefined,
    description: JSX.Element | undefined
] => {
    const change = originalDeposit.whatChanged(editedLUSD);

    if (haveOwnFrontend) {
        return [
            undefined,
            <ErrorDescription key={0}>
                You can’t deposit using a wallet address that is registered as a
                frontend.
            </ErrorDescription>,
        ];
    }

    if (!change) {
        return [undefined, undefined];
    }

    if (change.depositLUSD?.gt(lusdBalance)) {
        return [
            undefined,
            <ErrorDescription key={1}>
                The amount you are trying to deposit exceeds your balance by{' '}
                <Amount>
                    {change.depositLUSD.sub(lusdBalance).prettify()} {COIN}
                </Amount>
                .
            </ErrorDescription>,
        ];
    }

    if (change.withdrawLUSD && haveUndercollateralizedTroves) {
        return [
            undefined,
            <ErrorDescription key={2}>
                You are not allowed to withdraw USDSF from your Stability
                Deposit when there are undercollateralized Troves. Please
                liquidate those Troves or try again later.
            </ErrorDescription>,
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
