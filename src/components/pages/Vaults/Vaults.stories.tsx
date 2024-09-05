import { withAppLayout, withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import { Vaults } from './Vaults';

export default {
    title: 'Pages/Vaults',
    component: Vaults,
    decorators: [withAppLayout, withWalletProvider],
    args: {},
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Vaults>;

const Template: StoryFn<typeof Vaults> = () => {
    return <Vaults />;
};

export const Default = Template.bind({});
