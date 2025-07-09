import type { Meta, StoryFn } from '@storybook/react';
import { TokenPrice } from './TokenPrice';
import { coinGeckoUrl } from 'src/constants';

export default {
    title: 'Atoms/TokenPrice',
    component: TokenPrice,
    args: {
        price: '3.01',
        source: coinGeckoUrl,
        symbol: 'USDFC',
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof TokenPrice>;

const Template: StoryFn<typeof TokenPrice> = args => <TokenPrice {...args} />;

export const Default = Template.bind({});
