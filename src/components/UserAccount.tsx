import { Menu } from '@headlessui/react';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button, ButtonSizes, Identicon } from 'src/components/atoms';
import { NETWORK_SWITCH_LINKS } from 'src/constants';
import { useBreakpoint, useSfStablecoin } from 'src/hooks';
import {
    AddressUtils,
    getCurrentNetworkLabel,
    getSupportedChains,
} from 'src/utils';
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

    const currentLabel = getCurrentNetworkLabel();

    return (
        <div className='flex flex-row items-center gap-2 laptop:gap-2'>
            <Menu as='div' className='relative text-left tablet:inline-block'>
                <Menu.Button
                    className='flex items-center gap-2 rounded-3xl border border-neutral-300 bg-neutral-50 px-3 py-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:px-3.5'
                    aria-label='Network switcher'
                >
                    <span className='relative flex h-2 w-2 items-center justify-center'>
                        <span className='absolute inline-flex h-2 w-2 rounded-full bg-success-500' />
                    </span>

                    <span className='hidden text-3 leading-3.5 text-neutral-900 desktop:inline desktop:text-3.5 desktop:leading-4.5'>
                        {currentLabel}
                    </span>

                    <ChevronDownIcon className='h-3.5 w-3.5 laptop:h-4 laptop:w-4' />
                </Menu.Button>

                <Menu.Items className='shadow-lg absolute right-0 z-10 mt-1 w-28 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    {Object.entries(NETWORK_SWITCH_LINKS).map(([key, href]) => {
                        const label =
                            key === 'mainnet' ? 'Mainnet' : 'Calibration';
                        const isCurrent = label === currentLabel;

                        return (
                            <Menu.Item key={key}>
                                {() => (
                                    <button
                                        onClick={() => {
                                            if (window.location.href !== href) {
                                                window.location.href = href;
                                            }
                                        }}
                                        className='flex w-full items-center justify-between gap-2 p-2 text-sm text-neutral-900'
                                    >
                                        <span>{label}</span>
                                        {isCurrent && (
                                            <span className='h-2 w-2 rounded-full bg-success-500' />
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        );
                    })}
                </Menu.Items>
            </Menu>

            {isConnected ? (
                <button
                    onClick={() => open()}
                    aria-label='Wallet menu'
                    className='flex items-center gap-2 rounded-3xl border border-neutral-300 px-3 py-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:px-3.5'
                >
                    <Identicon
                        value={account.toLowerCase()}
                        size={isMobile ? 14 : 16}
                    />
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
        </div>
    );
};
