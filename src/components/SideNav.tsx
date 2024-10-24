import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LINKS } from 'src/constants';
import { Button, Container, Flex } from 'theme-ui';
import { Icon } from './Icon';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';

const logoHeight = '32px';

export const SideNav: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const overlay = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation();

    if (!isVisible) {
        return (
            <button onClick={() => setIsVisible(true)} className='h-6 w-6'>
                <Icon name='bars' size='lg' />
            </button>
        );
    }
    return (
        <Container
            variant='infoOverlay'
            ref={overlay}
            onClick={e => {
                if (e.target === overlay.current) {
                    setIsVisible(false);
                }
            }}
        >
            <Flex variant='layout.sidenav'>
                <Button
                    sx={{ position: 'fixed', right: '25vw', m: 2 }}
                    variant='icon'
                    onClick={() => setIsVisible(false)}
                >
                    <Icon name='times' size='2x' />
                </Button>
                <SecuredFinanceLogo height={logoHeight} p={2} />
                <div className='flex flex-col gap-4'>
                    {LINKS.map(link => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            className={clsx(
                                'text-4.5 font-semibold leading-7 text-neutral-900',
                                {
                                    'text-primary-500': pathname === link.to,
                                }
                            )}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </Flex>
        </Container>
    );
};
