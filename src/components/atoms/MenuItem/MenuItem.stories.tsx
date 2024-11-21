import type { Meta, StoryFn } from '@storybook/react';
import { ExternalLinkIcon } from 'lucide-react';
import GitBook from 'src/assets/icons/gitbook.svg';
import { MenuItem } from './MenuItem';

export default {
    title: 'Atoms/MenuItem',
    component: MenuItem,
    args: {
        text: 'Example',
        icon: <GitBook className='h-4 w-4 rounded-full' />,
        badge: <ExternalLinkIcon className='h-4 w-4 text-white' />,
        link: 'https://secured.finance/',
    },
} as Meta<typeof MenuItem>;

const Template: StoryFn<typeof MenuItem> = args => (
    <div>
        <MenuItem {...args} />
    </div>
);

export const Default = Template.bind({});
