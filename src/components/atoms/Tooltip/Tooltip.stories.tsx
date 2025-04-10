import { expect } from '@storybook/jest';
import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';
import { ChevronsDownIcon, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { TooltipMode } from './types';

const ButtonIcon = (
    <button
        className='bg-teal flex items-center rounded-full p-5'
        data-testid='button-icon'
    >
        <ChevronsDownIcon className='h-6 w-6 text-white' />
    </button>
);

const InformationIcon = (
    <Info
        className='text-slateGray h-4 w-4 cursor-pointer'
        data-testid='information-circle'
    />
);

const children = (
    <p>If the conditions are fulfilled, the trade will be executed.</p>
);

export default {
    title: 'Molecules/Tooltip',
    component: Tooltip,
    args: {
        children: children,
        iconElement: InformationIcon,
    },
    parameters: {
        chromatic: { delay: 5000 },
    },
    decorators: [
        Story => (
            <div className='h-32'>
                <Story />
            </div>
        ),
    ],
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = args => (
    <div className='mx-10 flex w-full justify-center'>
        <Tooltip {...args} />
    </div>
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
    await waitFor(async () => {
        await expect(
            screen.getByText(
                'If the conditions are fulfilled, the trade will be executed.'
            )
        ).toBeInTheDocument();
    });
};

export const Success = Template.bind({});
Success.args = {
    mode: TooltipMode.Success,
};
Success.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};

export const Warning = Template.bind({});
Warning.args = {
    mode: TooltipMode.Warning,
};
Warning.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};

export const Error = Template.bind({});
Error.args = {
    mode: TooltipMode.Error,
};
Error.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};

export const WithCustomHoverIcon = Template.bind({});
WithCustomHoverIcon.args = {
    iconElement: ButtonIcon,
};

WithCustomHoverIcon.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('button-icon');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};
