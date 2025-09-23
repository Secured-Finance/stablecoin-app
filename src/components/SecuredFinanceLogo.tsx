import { NavLink } from 'react-router-dom';
import USDFCLogoSmall from 'src/assets/img/usdfc-logo-small.svg';
import USDFCLogo from 'src/assets/img/usdfc-logo.svg';

export const SecuredFinanceLogo = () => (
    <NavLink to='/'>
        <USDFCLogo className='hidden h-[25px] w-[90px] desktop:flex' />
        <USDFCLogoSmall className='flex h-[25px] w-[25px] desktop:hidden' />
    </NavLink>
);

export const USDFCIcon = () => (
    <>
        <USDFCLogo className='hidden h-[25px] w-[90px] desktop:flex' />
        <USDFCLogoSmall className='flex h-[25px] w-[25px] desktop:hidden' />
    </>
);
