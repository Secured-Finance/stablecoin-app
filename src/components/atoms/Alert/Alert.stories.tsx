// Alert.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './';
import { AlertColors } from './types';

const meta: Meta<typeof Alert> = {
    title: 'Atoms/Alert',
    component: Alert,
    argTypes: {
        color: {
            control: 'radio',
            options: ['error', 'warning', 'info'] as AlertColors[],
        },
        children: {
            control: 'text',
        },
    },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Error: Story = {
    args: {
        color: 'error',
        children: 'This is an error alert message',
    },
};

export const Warning: Story = {
    args: {
        color: 'warning',
        children: 'This is a warning alert message',
    },
};

export const Info: Story = {
    args: {
        color: 'info',
        children: 'This is an info alert message',
    },
};
