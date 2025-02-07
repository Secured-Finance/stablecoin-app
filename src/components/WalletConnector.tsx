import { useWeb3Modal } from '@web3modal/wagmi/react';
import USDFCLogo from 'src/assets/img/usdfc-logo.svg';
import { Button } from 'src/components/atoms';
import { Container } from 'theme-ui';
import { useAccount } from 'wagmi';
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
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();

    return isConnected ? (
        children
    ) : (
        <div className='relative flex h-screen w-full items-center justify-center bg-neutral-100'>
            <Button onClick={() => open()}>Connect Wallet</Button>
            <NavBar />
        </div>
    );
};
