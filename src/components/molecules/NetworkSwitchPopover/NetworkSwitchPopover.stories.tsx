import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { NetworkSwitchPopover } from './NetworkSwitchPopover';

const meta: Meta<typeof NetworkSwitchPopover> = {
    title: 'Molecules/NetworkSwitchPopover',
    component: NetworkSwitchPopover,
    parameters: {
        viewport: { disable: true },
    },
};

export default meta;

const Template: StoryFn<typeof NetworkSwitchPopover> = () => (
    <div className='w-fit'>
        <NetworkSwitchPopover />
    </div>
);

export const Default = Template.bind({});

export const Expanded = Template.bind({});
Expanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole('button');
    await menuButton.click();
};
