import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

export const MenuItem = ({
    text,
    link,
    isActive,
}: {
    text: string;
    link: string;
    isActive?: boolean;
}) => {
    return (
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
            </div>
        </NavLink>
    );
};
