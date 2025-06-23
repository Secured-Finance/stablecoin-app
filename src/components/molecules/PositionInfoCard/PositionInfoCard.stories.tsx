import type { Meta, StoryFn } from '@storybook/react';
import { Vault } from 'lucide-react';
import { PositionInfoCard } from './PositionInfoCard';

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
Default.args = {
    icon: Vault,
    title: 'No Trove Yet',
};
