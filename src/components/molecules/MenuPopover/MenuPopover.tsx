import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuExternalLink, MenuItem } from 'src/components/atoms';
import { getLinkList } from 'src/utils';

export const MenuPopover = ({ currentPath }: { currentPath: string }) => {
    const { pathname } = useLocation();
    const linkList = getLinkList();
    const isInMoreLinks = linkList.some(link => link.href === pathname);

    return (
        <div className='flex w-[120px] items-center justify-center'>
            <Popover className='relative'>
                {({ close, open }) => (
                    <>
                        <Popover.Button
                            as='button'
                            data-cy='popover-button'
                            className='flex flex-row items-center gap-2 whitespace-nowrap text-3.5 leading-4 text-neutral-800 outline-none'
                        >
                            <span className='flex items-center gap-2 font-primary'>
                                <span
                                    className={clsx(
                                        'h-2 w-2 rounded-full bg-primary-500  transition-all  duration-200',
                                        isInMoreLinks
                                            ? 'scale-100 opacity-100'
                                            : 'scale-0 opacity-0'
                                    )}
                                />
                                More
                            </span>

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
                                className='shadow-lg absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-white py-2'
                                role='menu'
                            >
                                <div className='relative flex flex-col overflow-hidden rounded-b-md bg-white py-1.5'>
                                    {linkList.map((link, index) => {
                                        return (
                                            <button
                                                key={index}
                                                role='menuitem'
                                                onClick={close}
                                                className='block text-sm hover:bg-neutral-100'
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
