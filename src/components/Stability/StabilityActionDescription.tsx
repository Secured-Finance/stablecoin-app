import {
    Decimal,
    StabilityDeposit,
    StabilityDepositChange,
} from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { COLLATERAL_PRECISION } from 'src/utils';
import { COIN, CURRENCY } from '../../strings';
import { ActionDescription, Amount } from '../ActionDescription';

type StabilityActionDescriptionProps = {
    originalDeposit: StabilityDeposit;
    change: StabilityDepositChange<Decimal>;
};

export const StabilityActionDescription: React.FC<
    StabilityActionDescriptionProps
> = ({ originalDeposit, change }) => {
    const collateralGain = originalDeposit.collateralGain.nonZero
        ?.prettify(COLLATERAL_PRECISION)
        .concat(' ', CURRENCY);
    // const protocolTokenReward = originalDeposit.protocolTokenReward.nonZero
    //     ?.prettify()
    //     .concat(' ', GT);

    return (
        <ActionDescription>
            {change.depositDebtToken ? (
                <>
                    You are depositing{' '}
                    <Amount>
                        {change.depositDebtToken.prettify()} {COIN}
                    </Amount>{' '}
                    in the Stability Pool
                </>
            ) : (
                <>
                    You are withdrawing{' '}
                    <Amount>
                        {change.withdrawDebtToken.prettify()} {COIN}
                    </Amount>{' '}
                    to your wallet
                </>
            )}
            {/* {(collateralGain || protocolTokenReward) && (
                <>
                    {' '}
                    and claiming at least{' '}
                    {collateralGain && protocolTokenReward ? (
                        <>
                            <Amount>{collateralGain}</Amount> and{' '}
                            <Amount>{protocolTokenReward}</Amount>
                        </>
                    ) : (
                        <Amount>{collateralGain ?? protocolTokenReward}</Amount>
                    )}
                </>
            )} */}
            {collateralGain && (
                <>
                    {' '}
                    and claiming at least <Amount>{collateralGain}</Amount>
                </>
            )}
            .
        </ActionDescription>
    );
};
