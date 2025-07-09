import type { Meta, StoryFn } from '@storybook/react';
import { ProtocolOverview } from './ProtocolOverview';
import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';

const mockData = {
    numberOfTroves: 42,
    price: Decimal.from('3.14'),
    total: {
        collateral: Decimal.from('1000'),
        debt: Decimal.from('500'),
        collateralRatio: (price: Decimal) => Decimal.from(price),
    } as Trove,
    debtTokenInStabilityPool: Decimal.from('50'),
    borrowingRate: Decimal.from('0.02'),
    redemptionRate: Decimal.from('0.01'),
    totalStakedProtocolToken: Decimal.from('200'),
    kickbackRate: null,
};

const mockContextData = {
    addresses: {
        debtToken: '0x1234567890abcdef',
    },
    chainId: 314,
    deploymentDate: new Date('2023-01-01'),
};

export default {
    title: 'Organism/ProtocolOverview',
    component: ProtocolOverview,
} as Meta<typeof ProtocolOverview>;

const Template: StoryFn<typeof ProtocolOverview> = args => (
    <ProtocolOverview {...args} />
);

export const Default = Template.bind({});
Default.args = {
    data: mockData,
    contextData: mockContextData,
};
