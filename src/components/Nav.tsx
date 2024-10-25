import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { LINKS } from 'src/constants';

export const Nav: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <div className='hidden laptop:flex'>
            {LINKS.map(link => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={clsx(
                        'px-4 text-3.5 leading-6 text-neutral-800',
                        {
                            'font-semibold text-primary-500':
                                pathname === link.to,
                        }
                    )}
                >
                    {link.label}
                </NavLink>
            ))}
        </div>
    );
};
