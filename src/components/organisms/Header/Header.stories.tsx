import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import Header from './Header';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {},
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        viewport: {
            disable: true,
        },
    },
    decorators: [withWalletProvider],
} as Meta<typeof Header>;

const Template: StoryFn<typeof Header> = () => <Header />;

export const Primary = Template.bind({});
