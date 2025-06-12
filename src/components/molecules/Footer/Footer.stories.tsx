import type { Meta, StoryFn } from '@storybook/react';
import { Footer } from './Footer';

export default {
    title: 'Molecules/Footer',
    component: Footer,
    argTypes: {},
    parameters: {},
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = () => (
    <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
        <div style={{ flex: 1 }} />
        <Footer />
    </div>
);

export const Default = Template.bind({});
