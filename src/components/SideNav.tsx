import clsx from 'clsx';
import { t } from 'i18next';
import React, { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import MenuIcon from 'src/assets/icons/menu.svg';
import XIcon from 'src/assets/icons/x.svg';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';

export const SideNav: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const overlay = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation();

    const handleOutsideClick = (
        e:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (e.target === overlay.current) {
            setIsVisible(false);
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className='flex items-center justify-center laptop:hidden'
            >
                <MenuIcon className='h-6 w-6' />
            </button>
        );
    }
    return (
        <div
            ref={overlay}
            tabIndex={0}
            className='fixed inset-0 z-50 h-screen w-screen bg-neutral-600/50 laptop:hidden'
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleOutsideClick(e);
                }
            }}
            role='button'
            onClick={handleOutsideClick}
        >
            <aside className='flex h-full w-3/4 min-w-[280px] flex-col gap-8 bg-neutral-50 p-4 shadow-sidenav'>
                <div className='flex items-center justify-between'>
                    <SecuredFinanceLogo />
                    <button onClick={() => setIsVisible(false)}>
                        <XIcon className='h-6 w-6 font-bold text-primary-500' />
                    </button>
                </div>
                <div className='flex flex-col gap-4'>
                    <NavLink
                        to={'/'}
                        className={clsx(
                            'text-4.5 font-semibold leading-7 text-neutral-900',
                            {
                                'text-primary-500': pathname === '/',
                            }
                        )}
                        onClick={() => setIsVisible(false)}
                    >
                        {t('common.stablecoin')}
                    </NavLink>
                    <NavLink
                        to={'/risky-troves'}
                        className={clsx(
                            'text-4.5 font-semibold leading-7 text-neutral-900',
                            {
                                'text-primary-500':
                                    pathname === '/risky-troves',
                            }
                        )}
                        onClick={() => setIsVisible(false)}
                    >
                        {t('common.risky-troves')}
                    </NavLink>
                </div>
            </aside>
        </div>
    );
};
