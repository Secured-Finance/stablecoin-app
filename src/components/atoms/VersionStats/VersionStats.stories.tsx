import type { Meta, StoryFn } from '@storybook/react';
import { VersionStats } from './VersionStats';
export default {
    title: 'Atoms/VersionStats',
    component: VersionStats,
    args: {
        stats: {
            versionStats: [
                {
                    label: 'Contract',
                    value: '0x9823343423',
                    link: 'https://app.usdfc.net',
                },
                {
                    label: 'Frontend Version',
                    value: '1.2.3',
                    subValue: '13 March 2025',
                },
            ],
        },
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof VersionStats>;

const Template: StoryFn<typeof VersionStats> = args => (
    <VersionStats {...args} />
);

export const Default = Template.bind({});
