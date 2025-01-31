import type { Meta, StoryFn } from '@storybook/react';
import GitBook from 'src/assets/icons/gitbook.svg';
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

export const External = Template.bind({});
External.args = {
    text: 'External Link',
    icon: <GitBook className='h-4 w-4 rounded-full' />,
    link: 'https://secured.finance/',
    isExternal: true,
};
