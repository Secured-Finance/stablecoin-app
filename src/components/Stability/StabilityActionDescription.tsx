import {
    Decimal,
    StabilityDeposit,
    StabilityDepositChange,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import React from 'react';
import { COLLATERAL_PRECISION } from 'src/utils';
import { COIN } from '../../strings';
import { ActionDescription } from '../ActionDescription';

type StabilityActionDescriptionProps = {
    originalDeposit: StabilityDeposit;
    change: StabilityDepositChange<Decimal>;
};

export const StabilityActionDescription: React.FC<
    StabilityActionDescriptionProps
> = ({ originalDeposit, change }) => {
    const collateralGain = originalDeposit.collateralGain.nonZero
        ?.prettify(COLLATERAL_PRECISION)
        .concat(' tFIL');
    // const protocolTokenReward = originalDeposit.protocolTokenReward.nonZero
    //     ?.prettify()
    //     .concat(' ', GT);

    return (
        <ActionDescription>
            {change.depositDebtToken
                ? t('card-component.depositing-info', {
                      COIN,
                      AMOUNT: change.depositDebtToken.prettify(),
                  })
                : t('card-component.withdrawing-info', {
                      COIN,
                      AMOUNT: change.withdrawDebtToken.prettify(),
                  })}
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
                    {t('card-component.claiming-info', {
                        COLLARERAL: collateralGain,
                    })}
                </>
            )}
        </ActionDescription>
    );
};
