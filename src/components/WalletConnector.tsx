import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from 'theme-ui';
import { useAccount } from 'wagmi';

export const WalletConnector: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();

    return isConnected ? (
        children
    ) : (
        <div className='flex h-screen w-full items-center justify-center'>
            <Button onClick={() => open()}>Connect Wallet</Button>
        </div>
    );
};
