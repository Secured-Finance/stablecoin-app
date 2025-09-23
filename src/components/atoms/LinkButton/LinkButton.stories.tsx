import type { Meta, StoryFn } from '@storybook/react';
import { LinkButton } from './LinkButton';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default {
    title: 'Atoms/LinkButton',
    component: LinkButton,
    args: {
        children: 'Click Me',
        disabled: false,
    },
} as Meta<typeof LinkButton>;

const Template: StoryFn<typeof LinkButton> = args => (
    <div>
        <LinkButton {...args} />
    </div>
);

export const Default = Template.bind({});

export const WithLeftIcon = Template.bind({});
WithLeftIcon.args = {
    leftIcon: <ArrowLeft size={16} />,
};

export const WithRightIcon = Template.bind({});
WithRightIcon.args = {
    rightIcon: <ArrowRight size={16} />,
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
    children: 'Disabled',
};

export const CustomClassName = Template.bind({});
CustomClassName.args = {
    className: 'bg-blue-100 text-blue-700 px-3 py-1 rounded',
};
