import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuPopover } from 'src/components/molecules';
import { HEADER_LINKS } from 'src/constants';

export const Nav: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <div className='relative hidden h-full laptop:flex'>
            {HEADER_LINKS.map(link => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={clsx(
                        'flex items-center justify-center text-3.5 leading-6',
                        'w-[120px]'
                        // pathname === link.to
                        //     ? 'text-primary-500'
                        //     : 'text-neutral-900'
                    )}
                >
                    <span className='flex items-center gap-1 font-primary'>
                        {pathname === link.to && (
                            <span className='h-2 w-2 rounded-full bg-primary-500' />
                        )}
                        {link.label}
                    </span>
                </NavLink>
            ))}
            <MenuPopover currentPath={pathname} />
        </div>
    );
};
