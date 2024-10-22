import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { Button } from './atoms';

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
