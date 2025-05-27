import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Container } from 'theme-ui';
import { Nav } from './Nav';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';
import { SideNav } from './SideNav';
import { ConnectButton } from './ConnectButton';
import { NavLink } from 'react-router-dom';

const select = ({ frontend }: SfStablecoinStoreState) => ({
    frontend,
});

export const Header: React.FC<React.PropsWithChildren> = ({ children }) => {
    const {
        config: { frontendTag },
    } = useSfStablecoin();
    const { frontend } = useSfStablecoinSelector(select);
    const isFrontendRegistered =
        frontendTag === AddressZero || frontend.status === 'registered';

    return (
        <Container variant='header'>
            <div className='flex w-full items-center justify-between gap-3 desktop:gap-8'>
                <div className='flex items-center gap-2'>
                    <NavLink
                        className={
                            'flex items-center gap-2 font-numerical text-6 font-semibold'
                        }
                        to='/'
                    >
                        <SecuredFinanceLogo />
                    </NavLink>
                    {isFrontendRegistered && (
                        <div className='block desktop:hidden'>
                            <SideNav />
                        </div>
                    )}
                </div>

                {isFrontendRegistered && (
                    <div className='hidden laptop:block'>
                        <Nav />
                    </div>
                )}
                <ConnectButton />
            </div>

            {children}
        </Container>
    );
};
