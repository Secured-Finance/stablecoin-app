import { useWeb3Modal } from '@web3modal/wagmi/react';
import { filecoin, filecoinCalibration } from 'viem/chains';
import { useAccount, useChainId } from 'wagmi';

export function ConnectButton() {
    const { open } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const chain = [filecoin, filecoinCalibration].find(c => c.id === chainId);

    if (!isConnected) {
        return (
            <button
                onClick={() => open()}
                className='rounded-full bg-primary-500 px-6 py-2 font-medium text-white hover:bg-primary-500/80'
            >
                Connect Wallet
            </button>
        );
    }

    if (!chain) {
        return (
            <button
                onClick={() => open({ view: 'Networks' })}
                className='rounded-full bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600'
            >
                Wrong network
            </button>
        );
    }

    return (
        <div className='flex gap-2'>
            <button
                onClick={() => open()}
                className='flex items-center gap-2 rounded-full border border-[#e3e3e3] px-4 py-1.5 text-sm font-medium'
            >
                {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
        </div>
    );
}
