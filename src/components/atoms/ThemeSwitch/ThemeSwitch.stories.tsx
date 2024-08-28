import type { Meta, StoryFn } from '@storybook/react';
import { ThemeSwitch } from './ThemeSwitch';

export default {
    title: 'Atoms/ThemeSwitch',
    component: ThemeSwitch,
    args: {},
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof ThemeSwitch>;

const Template: StoryFn<typeof ThemeSwitch> = () => <ThemeSwitch />;

export const Default = Template.bind({});
