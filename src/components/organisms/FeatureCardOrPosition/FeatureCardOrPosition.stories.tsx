import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import type { Meta, StoryFn } from '@storybook/react';
import { FeatureCardsOrPositions } from './FeatureCardOrPosition';

export default {
    title: 'Organism/FeatureCardsOrPositions',
    component: FeatureCardsOrPositions,
} as Meta<typeof FeatureCardsOrPositions>;

const Template: StoryFn<typeof FeatureCardsOrPositions> = args => (
    <div className='min-h-screen w-full p-20'>
        <FeatureCardsOrPositions {...args} />
    </div>
);

export const NotConnected = Template.bind({});
NotConnected.args = {
    data: {
        isConnected: false,
    },
};

export const ConnectedNoPositions = Template.bind({});
ConnectedNoPositions.args = {
    data: {
        isConnected: true,
    },
};

export const WithPositions = Template.bind({});
WithPositions.args = {
    data: {
        isConnected: true,
        debtTokenInStabilityPool: Decimal.from('1000'),
        trove: Trove.create({
            borrowDebtToken: '5000',
            depositCollateral: '10',
        }),
        price: Decimal.from('500'),
        originalDeposit: {
            collateralGain: Decimal.from('0.5'),
            currentDebtToken: Decimal.from('1000'),
        },
    },
};
