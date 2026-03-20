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
                        'flex w-[120px] items-center justify-center text-3.5 leading-6'
                    )}
                >
                    <span className='flex items-center gap-2 font-primary text-4'>
                        <span
                            className={clsx(
                                'h-2 w-2 rounded-full transition-all duration-200',
                                pathname === link.to
                                    ? 'scale-100 bg-primary-500 opacity-100'
                                    : 'scale-0 bg-primary-500 opacity-0'
                            )}
                        />
                        {link.label}
                    </span>
                </NavLink>
            ))}
            <MenuPopover currentPath={pathname} />
        </div>
    );
};
