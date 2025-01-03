import clsx from 'clsx';
import { t } from 'i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuPopover } from 'src/components/molecules';
import { LINKS } from 'src/constants';

export const Nav: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <div className='hidden laptop:flex'>
            {LINKS.map(({ to, labelKey }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={clsx(
                        'px-4 text-3.5 leading-6 text-neutral-800',
                        {
                            'font-semibold text-primary-500': pathname === to,
                        }
                    )}
                >
                    {t(labelKey)}
                </NavLink>
            ))}
            <MenuPopover />
        </div>
    );
};
