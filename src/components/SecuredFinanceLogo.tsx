import React from 'react';
import { NavLink } from 'react-router-dom';
import SFLogo from 'src/assets/img/logo-light.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Box } from 'theme-ui';

type SecuredFinanceLogoProps = React.ComponentProps<typeof Box> & {
    height?: number | string;
};

export const SecuredFinanceLogo: React.FC<SecuredFinanceLogoProps> = () => (
    <NavLink to='/'>
        <SFLogo className='hidden h-4 w-40 laptop:flex' />
        <SFLogoSmall className='flex h-[25px] w-7 laptop:hidden' />
    </NavLink>
);
