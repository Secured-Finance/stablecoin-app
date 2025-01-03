import { useWeb3Modal } from '@web3modal/wagmi/react';
import { t } from 'i18next';
import SFLogoLight from 'src/assets/img/logo-light.svg';
import { Button, ButtonSizes } from 'src/components/atoms';
import { useAccount } from 'wagmi';

const NavBar = () => {
    return (
        <div className='absolute top-0 w-full'>
            <nav data-cy='header' className='h-14 w-full bg-white'>
                <div className='flex h-full items-center px-5'>
                    <SFLogoLight className='inline h-4 w-40' />
                </div>
            </nav>
        </div>
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
            <Button onClick={() => open()} size={ButtonSizes.lg}>
                {t('common.connect-wallet')}
            </Button>
            <NavBar />
        </div>
    );
};
