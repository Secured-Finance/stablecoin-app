import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { Fragment } from 'react';
import { MenuExternalLink, MenuItem, Separator } from 'src/components/atoms';
import { LinkList } from 'src/utils';

export const MenuPopover = ({ currentPath }: { currentPath: string }) => {
    return (
        <div className='flex items-center justify-center px-4'>
            <Popover className='relative'>
                {({ close, open }) => (
                    <>
                        <Popover.Button
                            as='button'
                            data-cy='popover-button'
                            className='flex flex-row items-center gap-1 whitespace-nowrap text-3.5 leading-4 text-neutral-800 outline-none'
                        >
                            <span>More</span>
                            <ChevronDown
                                className={clsx('h-4 w-4 text-neutral-600', {
                                    'rotate-180': open,
                                })}
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
                                className='absolute -left-4 z-10 mt-5 w-[200px]'
                                role='menu'
                            >
                                <div className='relative flex flex-col overflow-hidden rounded-b-md bg-white py-1.5'>
                                    {LinkList.map((link, index) => {
                                        return (
                                            <button
                                                key={index}
                                                role='menuitem'
                                                onClick={close}
                                            >
                                                {link.isExternal ? (
                                                    <MenuExternalLink
                                                        text={link.text}
                                                        icon={link.icon}
                                                        link={link.href}
                                                    />
                                                ) : (
                                                    <MenuItem
                                                        text={link.text}
                                                        link={link.href}
                                                        isActive={
                                                            currentPath ===
                                                            link.href
                                                        }
                                                    />
                                                )}
                                                {index !==
                                                    LinkList.length - 1 && (
                                                    <Separator color='neutral-100' />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
};
