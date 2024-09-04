import type { Meta, StoryFn } from '@storybook/react';
import { NavTab } from '.';

export default {
    title: 'Atoms/NavTab',
    component: NavTab,
    args: {
        text: 'Tab',
        active: true,
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof NavTab>;

const Template: StoryFn<typeof NavTab> = args => (
    <div className='max-w-[175px]'>
        <NavTab {...args} />
    </div>
);

export const Default = Template.bind({});
