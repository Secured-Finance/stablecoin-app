import Link from 'next/link';
import SFLogo from 'src/assets/img/logo-light.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';

export const SecuredFinanceLogo = () => (
    <Link href='/'>
        <SFLogo className='hidden h-4 w-40 laptop:flex' />
        <SFLogoSmall className='flex h-[25px] w-7 laptop:hidden' />
    </Link>
);
