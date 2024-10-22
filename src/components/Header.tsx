import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Box, Container, Flex } from 'theme-ui';
import { LiquityLogo } from './LiquityLogo';
import { Nav } from './Nav';
import { SideNav } from './SideNav';

const logoHeight = '32px';

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
            <Flex sx={{ alignItems: 'center', flex: 1 }}>
                <LiquityLogo height={logoHeight} />

                <Box
                    sx={{
                        mx: [2, 3],
                        width: '0px',
                        height: '100%',
                        borderLeft: ['none', '1px solid lightgrey'],
                    }}
                />
                {isFrontendRegistered && (
                    <>
                        <SideNav />
                        <Nav />
                    </>
                )}
            </Flex>

            {children}
        </Container>
    );
};
