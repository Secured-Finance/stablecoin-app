import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { navigateToTop } from 'src/utils/navigation';
import { Container } from 'theme-ui';
import { Nav } from './Nav';
import { USDFCIconLarge } from './SecuredFinanceLogo';
import { SideNav } from './SideNav';
import { UserAccount } from './UserAccount';
import { Link } from 'react-router-dom';

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
                        <USDFCIconLarge />
                        <span className='hidden h-[31px] w-[78px] items-center font-numerical text-6 font-semibold laptop:flex'>
                            USDFC
                        </span>
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
