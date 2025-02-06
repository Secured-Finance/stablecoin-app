import { NavLink } from 'react-router-dom';
import SFLogo from 'src/assets/img/logo-light.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';

export const SecuredFinanceLogo = () => (
    <NavLink to='/'>
        <SFLogo className='hidden h-4 w-40 desktop:flex' />
        <SFLogoSmall className='flex h-[25px] w-7 desktop:hidden' />
    </NavLink>
);
