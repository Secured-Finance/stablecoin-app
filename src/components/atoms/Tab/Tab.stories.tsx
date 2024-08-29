import type { Meta, StoryFn } from '@storybook/react';
import { Tab } from '.';

export default {
    title: 'Atoms/Tab',
    component: Tab,
    args: {
        text: 'Tab',
        active: true,
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof Tab>;

const Template: StoryFn<typeof Tab> = args => (
    <div className='max-w-[175px]'>
        <Tab {...args} />
    </div>
);

export const Default = Template.bind({});
