import type { Meta, StoryFn } from '@storybook/react';
import { PositionInfoCard } from './PositionInfoCard';
import { Vault } from 'lucide-react';

export default {
    title: 'Molecules/PositionInfoCard',
    component: PositionInfoCard,
    args: {
        icon: Vault,
        title: 'No Trove Yet',
    },
    argTypes: {},
    parameters: {},
} as Meta<typeof PositionInfoCard>;

const Template: StoryFn<typeof PositionInfoCard> = args => (
    <PositionInfoCard {...args} />
);

export const Default = Template.bind({});
