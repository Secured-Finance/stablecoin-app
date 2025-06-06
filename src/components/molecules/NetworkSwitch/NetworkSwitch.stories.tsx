import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { NetworkSwitch } from './NetworkSwitch';

const meta: Meta<typeof NetworkSwitch> = {
    title: 'Molecules/NetworkSwitch',
    component: NetworkSwitch,
    parameters: {
        viewport: { disable: true },
    },
};

export default meta;

const Template: StoryFn<typeof NetworkSwitch> = () => (
    <div className='w-fit'>
        <NetworkSwitch />
    </div>
);

export const Default = Template.bind({});

export const Expanded = Template.bind({});
Expanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole('button');
    await menuButton.click();
};
