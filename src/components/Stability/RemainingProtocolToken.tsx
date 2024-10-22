import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React from 'react';
import { useSfStablecoinSelector } from 'src/hooks';
import { Flex } from 'theme-ui';

const selector = ({
    remainingStabilityPoolProtocolTokenReward,
}: SfStablecoinStoreState) => ({
    remainingStabilityPoolProtocolTokenReward,
});

export const RemainingProtocolToken: React.FC = () => {
    const { remainingStabilityPoolProtocolTokenReward } =
        useSfStablecoinSelector(selector);

    return (
        <Flex sx={{ mr: 2, fontSize: 2, fontWeight: 'medium' }}>
            {remainingStabilityPoolProtocolTokenReward.prettify(0)} SCR
            remaining
        </Flex>
    );
};
