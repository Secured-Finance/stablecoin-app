import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';

export default {
    title: 'Atoms/ThemeSwitch',
    component: ThemeSwitch,
    args: {
        checked: true,
        onCheckedChange: () => {},
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof ThemeSwitch>;

const Template: StoryFn<typeof ThemeSwitch> = args => {
    const [checked, setChecked] = useState(args.checked);
    const handleChange = (isChecked: boolean) => {
        setChecked(isChecked);
        args.onCheckedChange(isChecked);
    };

    return <ThemeSwitch checked={checked} onCheckedChange={handleChange} />;
};

export const Default = Template.bind({});

export const UnChecked = Template.bind({});
UnChecked.args = {
    checked: false,
};
