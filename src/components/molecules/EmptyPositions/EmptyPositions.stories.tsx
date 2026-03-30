import type { Meta, StoryFn } from '@storybook/react';
import { EmptyPositions } from './EmptyPosition';
import { MemoryRouter } from 'react-router-dom';

export default {
    title: 'Molecules/EmptyPositions',
    component: EmptyPositions,
    parameters: {
        viewport: {
            disable: true,
        },
    },
    decorators: [
        Story => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
} as Meta<typeof EmptyPositions>;

const Template: StoryFn<typeof EmptyPositions> = () => (
    <div className='w-full'>
        <EmptyPositions />
    </div>
);

export const Default = Template.bind({});
