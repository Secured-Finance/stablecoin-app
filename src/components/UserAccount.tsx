import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import React, { useEffect } from 'react';
import { Button, ButtonSizes, Identicon } from 'src/components/atoms';
import { useBreakpoint, useSfStablecoin } from 'src/hooks';
import { AddressUtils, getSupportedChains } from 'src/utils';
import { useAccount, useWalletClient } from 'wagmi';

export const UserAccount: React.FC = () => {
    const isMobile = useBreakpoint('laptop');
    const { account } = useSfStablecoin();
    const { open } = useWeb3Modal();
    const { open: isOpen } = useWeb3ModalState();
    const wallet = useWalletClient();
    const { isConnected } = useAccount();
    const networks = getSupportedChains();

    useEffect(() => {
        if (!isOpen) {
            wallet.data?.getChainId().then(chainId => {
                if (!networks.map(({ id }) => id).includes(chainId)) {
                    setTimeout(() => open({ view: 'Networks' }), 100);
                }
            });
        }
    }, [isOpen, networks, open, wallet.data]);

    return (
        <div className='flex flex-row items-center gap-2 laptop:gap-2'>
            <>
                {isConnected ? (
                    <button
                        className='flex items-center gap-x-1 rounded-2xl border border-neutral-300 p-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:gap-x-1.5 laptop:px-3.5'
                        onClick={() => open()}
                    >
                        <span>
                            <Identicon
                                value={account.toLowerCase()}
                                size={isMobile ? 14 : 16}
                            />
                        </span>
                        <span
                            className='typography-desktop-body-5 hidden text-neutral-900 laptop:block'
                            data-cy='wallet-address'
                        >
                            {AddressUtils.format(account.toLowerCase(), 6)}
                        </span>
                    </button>
                ) : (
                    <Button
                        onClick={() => open()}
                        mobileText={'Connect'}
                        size={isMobile ? ButtonSizes.sm : ButtonSizes.md}
                        className='rounded-3xl'
                    >
                        Connect Wallet
                    </Button>
                )}
            </>
        </div>
    );
};
