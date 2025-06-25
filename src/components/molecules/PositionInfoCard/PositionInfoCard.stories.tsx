import type { Meta, StoryFn } from '@storybook/react';
import { Vault } from 'lucide-react';
import { PositionInfoCard } from './PositionInfoCard';

export default {
    title: 'Molecules/PositionInfoCard',
    component: PositionInfoCard,
    args: {
        icon: Vault,
        title: 'No Trove Yet',
        verticalHeader: false,
        children: (
            <div>
                <span>
                    A Trove is your personal vault where you can deposit FIL as
                    collateral to borrow USDFC with 0% interest, while
                    maintaining exposure to FIL
                </span>
                <button>Create Trove</button>
            </div>
        ),
    },
} as Meta<typeof PositionInfoCard>;

const Template: StoryFn<typeof PositionInfoCard> = args => (
    <PositionInfoCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
    icon: Vault,
    title: 'No Trove Yet',
};
