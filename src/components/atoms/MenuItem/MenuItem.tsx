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
            className='flex h-[43px] w-[170px] cursor-pointer items-center gap-0.5 px-6 py-3 hover:bg-neutral-100 focus:outline-none'
        >
            <p
                className={clsx(
                    'typography-desktop-body-5 grow text-left text-4 text-neutral-800',
                    { 'text-primary-500': isActive }
                )}
            >
                {text}
            </p>
        </NavLink>
    );
};
