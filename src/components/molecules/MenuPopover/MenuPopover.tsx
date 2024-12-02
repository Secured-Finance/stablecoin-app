import { Popover, Transition } from '@headlessui/react';
import { t } from 'i18next';
import { ChevronDown, ExternalLinkIcon } from 'lucide-react';
import { Fragment } from 'react';
import { MenuItem, Separator } from 'src/components/atoms';
import { LinkList } from 'src/utils';

export const MenuPopover = () => {
    return (
        <div className='flex h-full items-center justify-center px-4'>
            <Popover className='relative'>
                {({ close }) => (
                    <>
                        <Popover.Button
                            as='button'
                            data-testid='more-button'
                            data-cy='popover-button'
                            className='flex flex-row items-center gap-1 whitespace-nowrap text-3.5 leading-6 text-neutral-800 outline-none'
                        >
                            <span>{t('common.more')}</span>
                            <ChevronDown className='h-4 w-4 text-neutral-800' />
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
                                className='absolute -left-6 z-10 mt-4 w-56'
                                role='menu'
                            >
                                <div className='relative flex flex-col overflow-hidden rounded-lg bg-neutral-800 px-2.5 py-3'>
                                    {LinkList.map((link, index) => {
                                        return (
                                            <button
                                                key={index}
                                                role='menuitem'
                                                onClick={close}
                                            >
                                                <MenuItem
                                                    text={t(link.textKey)}
                                                    icon={link.icon}
                                                    link={link.href}
                                                    badge={<ExternalIcon />}
                                                />
                                                {index !==
                                                    LinkList.length - 1 && (
                                                    <div className='py-1.5'>
                                                        <Separator color='neutral-700' />
                                                    </div>
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

const ExternalIcon = () => <ExternalLinkIcon className='h-4 w-4 text-white' />;
