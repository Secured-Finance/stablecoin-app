import type { Meta, StoryFn } from '@storybook/react';
import { TokenPrice } from './TokenPrice';
import { PYTH_ORACLE_LINK, TELLOR_ORACLE_LINKS } from 'src/constants';

const filPriceSources = [
    { name: 'Pyth', href: PYTH_ORACLE_LINK },
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
