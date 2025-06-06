import type { Meta, StoryObj } from '@storybook/react';
import { BasePopover } from './BasePopover';

const meta: Meta<typeof BasePopover> = {
    title: 'Atoms/BasePopover',
    component: BasePopover,
};

export default meta;

type Story = StoryObj<typeof BasePopover>;

export const Default: Story = {
    args: {
        buttonLabel: <span>Options</span>,
        children: ({ close }) => (
            <>
                <button
                    onClick={close}
                    className='w-full px-4 py-2 text-left text-sm hover:bg-neutral-100'
                >
                    Item 1
                </button>
                <button
                    onClick={close}
                    className='w-full px-4 py-2 text-left text-sm hover:bg-neutral-100'
                >
                    Item 2
                </button>
            </>
        ),
    },
};
