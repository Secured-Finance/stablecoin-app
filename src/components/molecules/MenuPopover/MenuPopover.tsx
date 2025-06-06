import { ReactNode } from 'react';
import {
    BasePopover,
    MenuExternalLink,
    MenuItem,
    Separator,
} from 'src/components/atoms';
import { LinkList } from 'src/utils';

export const MenuPopover = ({ currentPath }: { currentPath: string }) => {
    return (
        <div className='flex w-[120px] items-center justify-center'>
            <BasePopover
                buttonLabel={<span>More</span>}
                buttonClassName='flex flex-row items-center gap-1 whitespace-nowrap text-3.5 leading-4 text-neutral-800 outline-none'
            >
                {({ close }) => (
                    <div className='relative flex flex-col overflow-hidden rounded-b-md bg-white'>
                        {LinkList.map(
                            (link, index): ReactNode => (
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
                                            isActive={currentPath === link.href}
                                        />
                                    )}
                                    {index !== LinkList.length - 1 && (
                                        <Separator color='neutral-100' />
                                    )}
                                </button>
                            )
                        )}
                    </div>
                )}
            </BasePopover>
        </div>
    );
};
