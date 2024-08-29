import type { Meta, StoryFn } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import { Page } from './Page';

const Content = ({
    color,
    content,
}: {
    color: 'red' | 'green';
    content: string;
}) => <div className={`bg-${color} p-10 text-white`}>{content}</div>;

export default {
    title: 'Templates/Page',
    component: Page,
    args: {
        children: <Content color='red' content='Content' />,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Page>;

const Template: StoryFn<typeof Page> = args => <Page {...args} />;

export const Default = Template.bind({});
