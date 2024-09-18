import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { DepositWithdrawBox } from '.';

export default {
    title: 'Molecules/DepositWithdrawBox',
    component: DepositWithdrawBox,
    args: {
        type: 'Deposit',
        currency: CurrencySymbol.FIL,
        balance: BigInt('112142140000000000000000'),
        onClick: () => {},
    },
    decorators: [withWalletProvider],
} as Meta<typeof DepositWithdrawBox>;

const Template: StoryFn<typeof DepositWithdrawBox> = args => {
    // const [value, setValue] = useState(args.value);
    // const handleChange = (newValue: string | undefined) => {
    //     setValue(newValue);
    //     args.onValueChange(newValue);
    // };
    return <DepositWithdrawBox {...args} />;
};

export const Default = Template.bind({});
