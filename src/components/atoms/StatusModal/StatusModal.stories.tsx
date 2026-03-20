import type { Meta, StoryFn } from '@storybook/react';
import { StatusModal } from './StatusModal';

export default {
    title: 'Atoms/StatusModal',
    component: StatusModal,
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        isOpen: true,
        transactionHash: '0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2',
    },
} as Meta<typeof StatusModal>;

const Template: StoryFn<typeof StatusModal> = args => <StatusModal {...args} />;

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
    showWaitingIndicator: true,
    transactionHash: undefined,
};

export const Confirmed = Template.bind({});
Confirmed.args = {
    type: 'confirmed',
    title: 'Transaction Confirmed',
    description:
        'Your transaction has been successfully confirmed on the blockchain.',
    onClose: () => {},
    onViewTransaction: () => {
        window.open(
            'https://filfox.info/tx/0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2',
            '_blank'
        );
    },
};

export const Failed = Template.bind({});
Failed.args = {
    type: 'failed',
    title: 'Transaction Failed',
    description:
        'Unfortunately, your transaction failed. Please try again or contact support if the issue persists.',
    onClose: () => {},
    transactionHash: undefined,
};

export const Warning = Template.bind({});
Warning.args = {
    type: 'warning',
    title: 'Action Required',
    description:
        'Please review the information below and take the necessary action.',
    onClose: () => {},
    transactionHash: undefined,
};

export const Info = Template.bind({});
Info.args = {
    type: 'info',
    title: 'Important Information',
    description:
        'Here is some important information you should be aware of before proceeding.',
    onClose: () => {},
    transactionHash: undefined,
};

export const LiquidationNoSurplus = Template.bind({});
LiquidationNoSurplus.args = {
    type: 'warning',
    title: 'Trove Liquidated',
    description:
        'Your Trove was liquidated because the collateral ratio fell below the minimum threshold. Your debt has been cleared and collateral was used to cover it.',
    onClose: () => {},
};

export const LiquidationWithSurplus = Template.bind({});
LiquidationWithSurplus.args = {
    type: 'warning',
    title: 'Trove Liquidated',
    description:
        'Your Trove was liquidated because the collateral ratio fell below the minimum threshold. Your debt has been cleared and you have surplus collateral to claim.',
    details: [
        {
            label: 'Surplus Collateral:',
            value: '0.5 FIL',
            valueClassName: 'font-medium text-green-700',
        },
    ],
    detailsClassName: 'border-green-200 bg-green-50',
    customActions: [
        {
            label: 'Claim 0.5 FIL',
            onClick: () => {},
            variant: 'primary',
        },
        {
            label: 'Close',
            onClick: () => {},
            variant: 'secondary',
        },
    ],
};

export const CustomActionsWithLoading = Template.bind({});
CustomActionsWithLoading.args = {
    type: 'info',
    title: 'Surplus Collateral Available',
    description: 'You have surplus collateral available to claim.',
    customActions: [
        {
            label: 'Claiming 0.5 FIL...',
            onClick: () => {},
            variant: 'primary',
            loading: true,
            disabled: true,
        },
        {
            label: 'Cancel',
            onClick: () => {},
            variant: 'secondary',
        },
    ],
};
