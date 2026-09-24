import type { Meta, StoryFn } from '@storybook/react';
import { REDSTONE_ORACLE_LINKS, TELLOR_ORACLE_LINKS } from 'src/constants';
import { TokenPrice } from './TokenPrice';

const filPriceSources = [
    { name: 'RedStone', href: REDSTONE_ORACLE_LINKS.testnet },
    { name: 'Tellor', href: TELLOR_ORACLE_LINKS.testnet },
];

export default {
    title: 'Atoms/TokenPrice',
    component: TokenPrice,
    args: {
        price: '3.01',
        sources: filPriceSources,
        symbol: 'USDFC',
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof TokenPrice>;

const Template: StoryFn<typeof TokenPrice> = args => <TokenPrice {...args} />;

export const Default = Template.bind({});
