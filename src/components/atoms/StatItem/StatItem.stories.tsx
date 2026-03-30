import type { Meta, StoryFn } from '@storybook/react';
import { StatItem } from './StatItem';

export default {
    title: 'Atoms/StatItem',
    component: StatItem,
    args: {
        stat: {
            label: 'Contract',
            value: '0x9823343423',
            link: 'https://app.usdfc.net',
            subValue: '90',
        },
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof StatItem>;

const Template: StoryFn<typeof StatItem> = args => <StatItem {...args} />;

export const Default = Template.bind({});
