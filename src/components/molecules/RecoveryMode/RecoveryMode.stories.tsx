import type { Meta, StoryFn } from '@storybook/react';
import { RecoveryMode } from './RecoveryMode';

export default {
    title: 'Molecules/RecoveryMode',
    component: RecoveryMode,
    args: {
        isActive: false,
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof RecoveryMode>;

const Template: StoryFn<typeof RecoveryMode> = args => (
    <RecoveryMode {...args} />
);

export const Default = Template.bind({});
