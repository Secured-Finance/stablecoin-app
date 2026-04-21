import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { Link } from 'react-router-dom';
import USDFCLogoSmall from 'src/assets/img/usdfc-logo-small.svg';
import USDFCLogo from 'src/assets/img/usdfc-logo.svg';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { navigateToTop } from 'src/utils/navigation';
import { Container } from 'theme-ui';
import { Nav } from './Nav';
import { SideNav } from './SideNav';
import { UserAccount } from './UserAccount';

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
            <div className='relative flex w-full items-center justify-between gap-3 desktop:gap-8'>
                <div className='flex items-center gap-2'>
                    <Link
                        to='/'
                        className='flex items-center justify-center gap-2'
                        aria-label='Home'
                        onClick={() => navigateToTop()}
                    >
                        <USDFCLogoSmall className='flex h-[34px] w-[34px] laptop:hidden' />
                        <USDFCLogo className='hidden h-[34px] w-[112px] laptop:flex' />
                    </Link>

                    {isFrontendRegistered && (
                        <div className='block desktop:hidden'>
                            <SideNav />
                        </div>
                    )}
                </div>

                {isFrontendRegistered && (
                    <div className='absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 laptop:block'>
                        <Nav />
                    </div>
                )}
                <UserAccount />
            </div>

            {children}
        </Container>
    );
};
