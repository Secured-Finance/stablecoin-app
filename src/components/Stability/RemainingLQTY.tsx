import { LiquityStoreState } from '@secured-finance/lib-base';
import React from 'react';
import { useLiquitySelector } from 'src/hooks';
import { Flex } from 'theme-ui';

const selector = ({ remainingStabilityPoolLQTYReward }: LiquityStoreState) => ({
    remainingStabilityPoolLQTYReward,
});

export const RemainingLQTY: React.FC = () => {
    const { remainingStabilityPoolLQTYReward } = useLiquitySelector(selector);

    return (
        <Flex sx={{ mr: 2, fontSize: 2, fontWeight: 'medium' }}>
            {remainingStabilityPoolLQTYReward.prettify(0)} SCR remaining
        </Flex>
    );
};
