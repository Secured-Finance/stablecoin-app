import type { Meta, StoryFn } from '@storybook/react';
import GitBook from 'src/assets/icons/gitbook.svg';
import { MenuExternalLink } from './MenuExternalLink';

export default {
    title: 'Atoms/MenuExternalLink',
    component: MenuExternalLink,
    args: {
        text: 'External Link',
        icon: <GitBook className='h-4 w-4 rounded-full' />,
        link: 'https://secured.finance/',
    },
} as Meta<typeof MenuExternalLink>;

const Template: StoryFn<typeof MenuExternalLink> = args => (
    <div>
        <MenuExternalLink {...args} />
    </div>
);

export const Default = Template.bind({});
