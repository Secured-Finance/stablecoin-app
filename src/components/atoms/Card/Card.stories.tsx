import type { Meta, StoryFn } from '@storybook/react';
import { Card } from './Card';

export default {
    title: 'Atoms/Card',
    component: Card,
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof Card>;

const Template: StoryFn<typeof Card> = () => (
    <Card>
        <h3 className='text-lg font-semibold'>Card Title</h3>
        <p className='text-sm text-secondary-400'>
            This is an example of content inside the Card component.
        </p>
    </Card>
);

export const Default = Template.bind({});
