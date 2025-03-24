import USDFCLogo from 'src/assets/img/usdfc-logo.svg';
import { Container } from 'theme-ui';
import { Nav } from './Nav';
import { SideNav } from './SideNav';

const NavBar = () => {
    return (
        <Container variant='header'>
            <div className='flex h-8 items-center gap-3 laptop:h-10 laptop:gap-8'>
                <USDFCLogo className='inline h-[25px] w-[90px]' />
                <SideNav />
                <Nav />
            </div>
        </Container>
    );
};

export const WalletConnector: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <div className='relative flex h-screen w-full flex-col bg-neutral-100'>
            <NavBar />
            {children}
        </div>
    );
};
