import type { Meta, StoryFn } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withAppLayout,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Earn } from './Earn';

export default {
    title: 'Pages/Earn',
    component: Earn,
    decorators: [withAppLayout, withWalletProvider],
    args: {},
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Earn>;

const Template: StoryFn<typeof Earn> = () => {
    return <Earn />;
};

export const Default = Template.bind({});
