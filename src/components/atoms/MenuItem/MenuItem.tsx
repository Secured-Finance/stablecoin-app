import clsx from 'clsx';
import Link from 'next/link';
import { NavLink } from 'react-router-dom';
import ArrowRight from 'src/assets/icons/arrow-right.svg';
import { formatDataCy } from 'src/utils';

export const MenuItem = ({
    text,
    icon,
    link,
    isExternal,
    isActive,
}: {
    text: string;
    icon?: React.ReactNode;
    link: string;
    isExternal: boolean;
    isActive?: boolean;
}) => {
    return isExternal ? (
        <Link
            href={link}
            className='flex h-full w-full cursor-pointer items-center px-5 py-[11px] hover:bg-neutral-100 focus:outline-none'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Menu Item'
            data-cy={formatDataCy(text)}
        >
            <div className='flex w-full cursor-pointer items-center gap-2'>
                {icon && <div className='h-5 w-5'>{icon}</div>}
                <p
                    className={clsx(
                        'typography-desktop-body-5 grow text-left text-neutral-800',
                        { 'text-primary-500': isActive }
                    )}
                >
                    {text}
                </p>
            </div>
        </Link>
    ) : (
        <NavLink
            to={link}
            className='flex h-full w-full cursor-pointer items-center px-5 py-[11px] hover:bg-neutral-100 focus:outline-none'
        >
            <div className='flex w-full cursor-pointer items-center gap-2'>
                <p
                    className={clsx(
                        'typography-desktop-body-5 grow text-left text-neutral-800',
                        { 'text-primary-500': isActive }
                    )}
                >
                    {text}
                </p>
                <ArrowRight className='h-5 w-5' />
            </div>
        </NavLink>
    );
};
