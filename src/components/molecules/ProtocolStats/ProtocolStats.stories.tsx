import type { Meta, StoryFn } from '@storybook/react';
import { ProtocolStats } from './ProtocolStats';

export default {
    title: 'Molecules/ProtocolStats',
    component: ProtocolStats,
    parameters: {
        viewport: {
            disable: true,
        },
    },
    args: {
        stats: {
            leftColumn: [
                {
                    label: 'Total Volume',
                    value: '230M',
                },

                {
                    label: 'USDFC Supply',
                    value: '54.34 billion',
                },
                {
                    label: 'Borrowing Fee',
                    value: '3.2%',
                },
            ],
            rightColumn: [
                {
                    label: 'Total Active Troves',
                    value: '132',
                },
                {
                    label: 'USDFC in Stability Pool',
                    value: '3.4 billion',
                    subValue: '23.34%',
                },
                {
                    label: 'Collatoral Ratio',
                    value: '23.2%',
                },
            ],
        },
    },
} as Meta<typeof ProtocolStats>;

const Template: StoryFn<typeof ProtocolStats> = args => (
    <ProtocolStats {...args} />
);

export const Default = Template.bind({});
