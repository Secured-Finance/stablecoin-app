import type { Meta, StoryFn } from '@storybook/react';
import { TransactionModal } from './TransactionModal';

export default {
    title: 'Atoms/TransactionModal',
    component: TransactionModal,
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        isOpen: true,
        transactionHash: '0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2',
    },
} as Meta<typeof TransactionModal>;

const Template: StoryFn<typeof TransactionModal> = args => (
    <TransactionModal {...args} />
);

export const Processing = Template.bind({});
Processing.args = {
    type: 'processing',
    title: 'Transaction Processing',
    description:
        'Your transaction is being processed. This may take 1 to 2 minutes to complete.',
    onViewTransaction: () => {
        window.open(
            'https://filfox.info/tx/0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2',
            '_blank'
        );
    },
};

export const Confirm = Template.bind({});
Confirm.args = {
    type: 'confirm',
    title: 'Confirm in Your Wallet',
    description:
        'Please confirm the transaction in your wallet to proceed. If no prompt appears, check your connection and try again.',
    transactionHash: undefined,
};

export const ConfirmWithHash = Template.bind({});
ConfirmWithHash.args = {
    type: 'confirm',
    title: 'Confirm in Your Wallet',
    description:
        'Please confirm the transaction in your wallet to proceed. If no prompt appears, check your connection and try again.',
    onViewTransaction: () => {
        window.open(
            'https://filfox.info/tx/0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2',
            '_blank'
        );
    },
};
