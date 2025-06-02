import type { Meta, StoryFn } from '@storybook/react';
import { PositionInfoCard } from './PositionInfoCard';
import { Vault } from 'lucide-react';

export default {
    title: 'Atoms/PositionInfoCard',
    component: PositionInfoCard,
    args: {
        icon: Vault,
        title: 'No Trove Yet',
        description: 'A Trove is your personal vault where you can deposit FIL',
        buttonText: 'Create Trove',
        to: '/trove',
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof PositionInfoCard>;

const Template: StoryFn<typeof PositionInfoCard> = args => (
    <PositionInfoCard {...args} />
);

export const Default = Template.bind({});
