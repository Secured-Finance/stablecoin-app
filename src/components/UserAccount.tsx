import { Menu } from '@headlessui/react';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button, ButtonSizes } from 'src/components/atoms';
import { NETWORK_SWITCH_LINKS } from 'src/constants';
import { useSfStablecoin } from 'src/hooks';
import {
    AddressUtils,
    getCurrentNetworkLabel,
    getSupportedChains,
} from 'src/utils';
import { navigateToTop } from 'src/utils/navigation';
import { useAccount, useWalletClient } from 'wagmi';

export const UserAccount: React.FC = () => {
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
                    className='flex h-[43px] items-center gap-2.5 rounded-full border border-neutral-300 bg-neutral-50 px-4 hover:border-primary-500 focus:outline-none active:bg-primary-300/30'
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

                <Menu.Items className='absolute right-0 z-10 mt-1 flex w-[170px] origin-top-right flex-col items-start rounded-xl border border-neutral-9 bg-white py-2 shadow-[0px_4px_8px_4px_rgba(0,0,0,0.06)] focus:outline-none'>
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
                                        className='flex h-[43px] w-full items-center justify-between gap-0.5 px-6 py-3 text-4 font-medium text-neutral-800 hover:bg-neutral-100'
                                    >
                                        <span>{label}</span>
                                        {isCurrent && (
                                            <span className='flex h-2 w-2 rounded-full bg-success-500' />
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
                    className='flex h-[43px] items-center gap-2.5 rounded-full border border-neutral-300 px-4 hover:border-primary-500 focus:outline-none active:bg-primary-300/30'
                >
                    <span
                        className='text-4 font-semibold leading-[19px] text-neutral-900'
                        data-cy='wallet-address'
                    >
                        {AddressUtils.format(account.toLowerCase(), 5, 3)}
                    </span>
                </button>
            ) : (
                <Button
                    onClick={() => navigateToTop(() => open())}
                    mobileText={'Connect'}
                    size={ButtonSizes.wallet}
                >
                    Connect Wallet
                </Button>
            )}
        </div>
    );
};
