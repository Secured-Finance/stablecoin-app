import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Container } from 'theme-ui';
import { Nav } from './Nav';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';
import { SideNav } from './SideNav';

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
            <div className='flex items-center gap-3 desktop:gap-8'>
                <SecuredFinanceLogo />
                {isFrontendRegistered && (
                    <>
                        <SideNav />
                        <Nav />
                    </>
                )}
            </div>

            {children}
        </Container>
    );
};
