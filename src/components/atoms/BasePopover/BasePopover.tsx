import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface BasePopoverProps {
    buttonLabel: ReactNode;
    children: (args: { close: () => void }) => React.ReactNode;
    buttonClassName?: string;
}
export const BasePopover = ({
    buttonLabel,
    children,
    buttonClassName,
}: BasePopoverProps) => {
    return (
        <Popover className='relative inline-block text-left'>
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={clsx(
                            'flex items-center gap-1 whitespace-nowrap text-3.5 leading-4 text-neutral-800 outline-none',
                            buttonClassName
                        )}
                    >
                        {buttonLabel}
                        <ChevronDown
                            className={clsx(
                                'h-4 w-4 text-neutral-600 transition',
                                {
                                    'rotate-180': open,
                                }
                            )}
                        />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-5'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-5'
                    >
                        <Popover.Panel
                            static
                            role='menu'
                            className='shadow-lg absolute z-10 mt-2 w-48 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                        >
                            {typeof children === 'function'
                                ? children({ close })
                                : children}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};
