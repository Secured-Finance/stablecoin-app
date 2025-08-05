import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Container } from 'theme-ui';
import { Nav } from './Nav';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';
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
        <Container variant='header' className='border-b border-neutral-9'>
            <div className='relative flex w-full items-center justify-between gap-3 desktop:gap-8'>
                <div className='flex items-center gap-2'>
                    <SecuredFinanceLogo />
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
