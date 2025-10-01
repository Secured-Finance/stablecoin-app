import { Menu } from '@headlessui/react';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button, ButtonSizes } from 'src/components/atoms';
import { NETWORK_SWITCH_LINKS } from 'src/constants';
import { useBreakpoint, useSfStablecoin } from 'src/hooks';
import {
    AddressUtils,
    getCurrentNetworkLabel,
    getSupportedChains,
} from 'src/utils';
import { navigateToTop } from 'src/utils/navigation';
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

    // Scroll lock when wallet modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const currentLabel = getCurrentNetworkLabel();

    return (
        <div className='flex flex-row items-center gap-2 laptop:gap-2'>
            <Menu as='div' className='relative text-left tablet:inline-block'>
                <Menu.Button
                    className='flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:gap-2.5 laptop:px-4 laptop:py-3'
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

                <Menu.Items className='shadow-lg absolute right-0 z-10 mt-1 w-28 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none laptop:w-32 desktop:w-full'>
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
                                        className='flex w-full items-center justify-between gap-2 p-2 text-xs text-neutral-900 laptop:text-sm'
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
                    onClick={() => navigateToTop(() => open())}
                    aria-label='Wallet menu'
                    className='flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:gap-2.5 laptop:px-4 laptop:py-3'
                >
                    <span
                        className='text-3 font-semibold leading-[100%] text-neutral-900 laptop:text-4'
                        data-cy='wallet-address'
                    >
                        {AddressUtils.format(account.toLowerCase(), 5, 3)}
                    </span>
                </button>
            ) : (
                <Button
                    onClick={() => navigateToTop(() => open())}
                    mobileText={'Connect'}
                    size={isMobile ? ButtonSizes.sm : ButtonSizes.md}
                    className='!rounded-full !px-4 !py-3 !text-4 !font-semibold !leading-[100%]'
                >
                    Connect Wallet
                </Button>
            )}
        </div>
    );
};
