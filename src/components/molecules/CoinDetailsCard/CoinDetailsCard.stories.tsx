import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { CollateralConfig } from 'satoshi-sdk';
import { CoinDetailsCard } from '.';

const collateralConfig: CollateralConfig = {
    NAME: 'Wrapped Bitcoin',
    ADDRESS: '0x1234567890abcdef1234567890abcdef12345678',
    DESCRIPTION: 'Wrapped Bitcoin collateral used in the system',
    DECIMALS: 8,
    TROVE_MANAGER_BEACON_PROXY_ADDRESS:
        '0xabcdef1234567890abcdef1234567890abcdef12',
    SORTED_TROVE_BEACON_PROXY_ADDRESS:
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    MIN_CR: 150, // Minimum collateral ratio (as a percentage)
    ANNUAL_INTEREST_RATE: 0.05, // 5% interest rate
    IS_NATIVE: false,
    DISPLAY_NAME: 'WBTC',
    PYTH_PRICE_ID: '0xabcdefabcdefabcdefabcdefabcdefabcdef1234',
};

export default {
    title: 'Molecules/CoinDetailsCard',
    component: CoinDetailsCard,
    args: {
        currency: collateralConfig,
    },
    decorators: [withWalletProvider],
} as Meta<typeof CoinDetailsCard>;

const Template: StoryFn<typeof CoinDetailsCard> = args => {
    // const [value, setValue] = useState(args.value);
    // const handleChange = (newValue: string | undefined) => {
    //     setValue(newValue);
    //     args.onValueChange(newValue);
    // };
    return <CoinDetailsCard {...args} />;
};

export const Default = Template.bind({});
