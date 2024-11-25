import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

export const Nav: React.FC = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    return (
        <div className='hidden laptop:flex'>
            <NavLink
                to={'/'}
                className={clsx('px-4 text-3.5 leading-6 text-neutral-800', {
                    'font-semibold text-primary-500': pathname === '/',
                })}
            >
                {t('common.stablecoin')}
            </NavLink>
            <NavLink
                to={'/risky-troves'}
                className={clsx('px-4 text-3.5 leading-6 text-neutral-800', {
                    'font-semibold text-primary-500':
                        pathname === '/risky-troves',
                })}
            >
                {t('common.risky-troves')}
            </NavLink>
        </div>
    );
};
