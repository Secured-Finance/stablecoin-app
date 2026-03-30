import type { Meta, StoryFn } from '@storybook/react';
import { FeatureCards } from './FeatureCards';

export default {
    title: 'Molecules/FeatureCards',
    component: FeatureCards,
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof FeatureCards>;

const Template: StoryFn<typeof FeatureCards> = () => <FeatureCards />;

export const Default = Template.bind({});
