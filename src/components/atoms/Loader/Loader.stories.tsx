import type { Meta, StoryFn } from '@storybook/react';
import { Loader } from '.';

export default {
    title: 'Atoms/Loader',
    component: Loader,
} as Meta<typeof Loader>;

const Template: StoryFn<typeof Loader> = () => <Loader />;

export const Default = Template.bind({});
