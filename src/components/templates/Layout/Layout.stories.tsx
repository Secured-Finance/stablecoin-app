import type { Meta, StoryFn } from '@storybook/react';
import Link from 'next/link';
import { RESPONSIVE_PARAMETERS, VIEWPORTS } from 'src/../.storybook/constants';
import { Layout } from './Layout';

const Main = () => (
    <div className='border-4 border-blue-300 bg-gray-400 text-white-80'>
        <Link href='/borrowing'>To Borrowing</Link>
    </div>
);

const LongMain = () => (
    <div className='h-[900px] border-4 border-orange-600 bg-orange-300 text-white-80'>
        This is very Long
    </div>
);

const NavBar = () => (
    <div className='bg-red-500 text-center text-14 text-white'>NavBar</div>
);

const Footer = () => (
    <div className='bg-teal-300 text-center text-9 text-white'>Footer</div>
);

export default {
    title: 'Templates/Layout',
    component: Layout,
    args: {
        children: <Main />,
        navBar: <NavBar />,
        footer: <Footer />,
    },
    argTypes: {
        children: { control: { disable: true } },
        navBar: { control: { disable: true } },
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Layout>;

const Template: StoryFn<typeof Layout> = args => (
    <Layout navBar={args.navBar} footer={args.footer}>
        {args.children}
    </Layout>
);

export const Default = Template.bind({});

export const LongContent = Template.bind({});
LongContent.args = {
    children: <LongMain />,
};
LongContent.parameters = {
    chromatic: {
        viewports: [VIEWPORTS.TABLET],
    },
};
