import React from 'react';
import { Flex } from 'theme-ui';

import { useLiquitySelector } from '@liquity/lib-react';
import { LiquityStoreState } from '@secured-finance/lib-base';

const selector = ({ remainingStabilityPoolLQTYReward }: LiquityStoreState) => ({
    remainingStabilityPoolLQTYReward,
});

export const RemainingLQTY: React.FC = () => {
    const { remainingStabilityPoolLQTYReward } = useLiquitySelector(selector);

    return (
        <Flex sx={{ mr: 2, fontSize: 2, fontWeight: 'medium' }}>
            {remainingStabilityPoolLQTYReward.prettify(0)} SFT remaining
        </Flex>
    );
};
