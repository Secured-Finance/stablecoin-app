import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuPopover } from 'src/components/molecules';
import { LINKS } from 'src/constants';

const BAR_POSITIONS = ['left-0', 'left-[25%]', 'left-[50%]', 'left-[75%]'];

export const Nav: React.FC = () => {
    const { pathname } = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const currentIndex = LINKS.findIndex(link => link.to === pathname);
        setActiveIndex(currentIndex === -1 ? 0 : currentIndex);
    }, [pathname]);

    return (
        <div className='relative hidden h-full laptop:flex'>
            {LINKS.map(link => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={clsx(
                        'flex items-center justify-center text-3.5 leading-6 text-neutral-800',
                        `w-[120px]`,
                        {
                            'text-primary-500': pathname === link.to,
                        }
                    )}
                >
                    {link.label}
                </NavLink>
            ))}
            <MenuPopover currentPath={pathname} />
            <span
                className={clsx(
                    'absolute bottom-0 -mb-2 h-1 w-1/4 bg-primary-500 transition-all duration-300',
                    BAR_POSITIONS[activeIndex],
                    {
                        hidden:
                            LINKS.findIndex(link => link.to === pathname) ===
                            -1,
                    }
                )}
            />
        </div>
    );
};
