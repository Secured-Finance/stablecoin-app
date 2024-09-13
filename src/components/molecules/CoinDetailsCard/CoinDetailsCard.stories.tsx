import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { CoinDetailsCard } from '.';

export default {
    title: 'Molecules/CoinDetailsCard',
    component: CoinDetailsCard,
    args: {
        currency: {
            NAME: 'FIL',
        },
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
