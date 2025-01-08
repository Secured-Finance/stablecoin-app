import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { useSfStablecoinSelector } from 'src/hooks';

const selector = ({
    remainingStabilityPoolProtocolTokenReward,
}: SfStablecoinStoreState) => ({
    remainingStabilityPoolProtocolTokenReward,
});

export const RemainingProtocolToken: React.FC = () => {
    const { remainingStabilityPoolProtocolTokenReward } =
        useSfStablecoinSelector(selector);

    return (
        <span className='typography-desktop-body-5 font-semibold text-neutral-900'>
            {remainingStabilityPoolProtocolTokenReward.prettify(0)} SCR
            remaining
        </span>
    );
};
