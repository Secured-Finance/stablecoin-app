import { expect } from '@storybook/jest';
import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';
import { Info } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';

const InformationIcon = (
    <Info
        className='h-4 w-4 cursor-pointer text-blue-500'
        data-testid='custom-tooltip-icon'
    />
);

export default {
    title: 'Atoms/CustomTooltip',
    component: CustomTooltip,
    args: {
        title: 'Sample Title',
        description:
            'This is a sample description for the custom tooltip component.',
        children: InformationIcon,
    },
    parameters: {
        chromatic: { delay: 5000 },
    },
    decorators: [
        Story => (
            <div className='h-48 p-8'>
                <Story />
            </div>
        ),
    ],
} as Meta<typeof CustomTooltip>;

const Template: StoryFn<typeof CustomTooltip> = args => (
    <div className='mx-10 flex w-full justify-center'>
        <CustomTooltip {...args} />
    </div>
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('custom-tooltip-icon');
    await userEvent.unhover(icon);
    await userEvent.hover(icon);
    await waitFor(async () => {
        await expect(screen.getByText('Sample Title')).toBeInTheDocument();
        await expect(
            screen.getByText(
                'This is a sample description for the custom tooltip component.'
            )
        ).toBeInTheDocument();
        await expect(screen.getByText('Read more')).toBeInTheDocument();
    });
};

export const WithCustomButton = Template.bind({});
WithCustomButton.args = {
    buttonText: 'Learn More',
    onButtonClick: () => alert('Custom button clicked!'),
};
WithCustomButton.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('custom-tooltip-icon');
    await userEvent.unhover(icon);
    await userEvent.hover(icon);
    await waitFor(async () => {
        await expect(screen.getByText('Learn More')).toBeInTheDocument();
    });
};

export const BottomPosition = Template.bind({});
BottomPosition.args = {
    position: 'bottom',
    title: 'Bottom Tooltip',
    description: 'This tooltip appears below the trigger element.',
};
BottomPosition.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('custom-tooltip-icon');
    await userEvent.unhover(icon);
    await userEvent.hover(icon);
};

export const LeftPosition = Template.bind({});
LeftPosition.args = {
    position: 'left',
    title: 'Left Tooltip',
    description: 'This tooltip appears to the left of the trigger element.',
};
LeftPosition.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('custom-tooltip-icon');
    await userEvent.unhover(icon);
    await userEvent.hover(icon);
};

export const RightPosition = Template.bind({});
RightPosition.args = {
    position: 'right',
    title: 'Right Tooltip',
    description: 'This tooltip appears to the right of the trigger element.',
};
RightPosition.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('custom-tooltip-icon');
    await userEvent.unhover(icon);
    await userEvent.hover(icon);
};

export const LongContent = Template.bind({});
LongContent.args = {
    title: 'Very Long Title That Should Wrap Properly',
    description:
        'This is a very long description that should demonstrate how the tooltip handles longer content. It should wrap properly within the fixed width of 329px and maintain good readability with proper line spacing.',
};
LongContent.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('custom-tooltip-icon');
    await userEvent.unhover(icon);
    await userEvent.hover(icon);
};
