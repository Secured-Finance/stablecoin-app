import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import type { Meta, StoryFn } from '@storybook/react';
import { Positions } from './Positions';

export default {
    title: 'Molecules/Positions',
    component: Positions,
    parameters: {
        viewport: {
            disable: true,
        },
    },
    args: {
        debtTokenInStabilityPool: Decimal.from('1000'),
        price: Decimal.from('500'),
        trove: Trove.create({
            borrowDebtToken: '1000',
            depositCollateral: '2',
        }),
        originalDeposit: {
            collateralGain: Decimal.from('0.12'),
            currentDebtToken: Decimal.from('500'),
        },
    },
} as Meta<typeof Positions>;

const Template: StoryFn<typeof Positions> = args => <Positions {...args} />;

export const Default = Template.bind({});
