import type { Meta, StoryFn } from '@storybook/react';
import { EmptyPositions } from './EmptyPosition';

export default {
    title: 'Atoms/EmptyPositions',
    component: EmptyPositions,
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof EmptyPositions>;

const Template: StoryFn<typeof EmptyPositions> = () => <EmptyPositions />;

export const Default = Template.bind({});
