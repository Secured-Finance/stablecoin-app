import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';

interface BasePopoverProps {
    buttonLabel: string;
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
                        <span>{buttonLabel}</span>
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
                            className='absolute -left-4 z-10 mt-5 w-[200px] rounded-md shadow-card'
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
