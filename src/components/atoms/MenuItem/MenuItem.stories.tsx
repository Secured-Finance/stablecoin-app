import type { Meta, StoryFn } from '@storybook/react';
import { MenuItem } from './MenuItem';

export default {
    title: 'Atoms/MenuItem',
    component: MenuItem,
    args: {
        text: 'Example',
        link: '/example',
        isExternal: false,
    },
} as Meta<typeof MenuItem>;

const Template: StoryFn<typeof MenuItem> = args => (
    <div>
        <MenuItem {...args} />
    </div>
);

export const Default = Template.bind({});

export const Active = Template.bind({});
Active.args = {
    text: 'Active',
    isActive: true,
};
