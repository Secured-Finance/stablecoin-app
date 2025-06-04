import { Menu } from '@headlessui/react';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import ExternalLink from 'src/assets/icons/external-link.svg';
import FilecoinLogo from 'src/assets/icons/filecoin-network.svg';
import USDFCLogo from 'src/assets/img/usdfc-logo-small.svg';
import { Button, ButtonSizes, Identicon } from 'src/components/atoms';
import { NETWORK_SWITCH_LINKS } from 'src/constants';
import {
    useBreakpoint,
    useSfStablecoin,
    useSfStablecoinSelector,
} from 'src/hooks';
import { COIN, CURRENCY } from 'src/strings';
import {
    AddressUtils,
    getCurrentNetworkLabel,
    getFixedIncomeMarketLink,
    getSupportedChains,
    ordinaryFormat,
} from 'src/utils';
import { useAccount, useWalletClient } from 'wagmi';

const select = ({
    accountBalance,
    debtTokenBalance,
    protocolTokenBalance,
}: SfStablecoinStoreState) => ({
    accountBalance,
    debtTokenBalance,
    protocolTokenBalance,
});

export const UserAccount: React.FC = () => {
    const isMobile = useBreakpoint('laptop');
    const { account } = useSfStablecoin();
    const { open } = useWeb3Modal();
    const { open: isOpen } = useWeb3ModalState();
    const { accountBalance, debtTokenBalance } =
        useSfStablecoinSelector(select);
    const wallet = useWalletClient();
    const { isConnected } = useAccount();
    const networks = getSupportedChains();

    const currentLabel = getCurrentNetworkLabel();

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
                <Link
                    href={getFixedIncomeMarketLink()}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Fixed Income'
                >
                    <div className='flex items-center gap-x-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1.5 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:px-3.5'>
                        <span className='text-3 leading-3.5 text-neutral-900 laptop:text-3.5 laptop:leading-4.5'>
                            Fixed Income
                        </span>
                        <ExternalLink className='h-3.5 w-3.5 laptop:h-4 laptop:w-4' />
                    </div>
                </Link>
                {isConnected ? (
                    <button
                        className='flex items-center gap-x-1 rounded-md border border-neutral-300 p-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:gap-x-1.5 laptop:px-3.5'
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
                    >
                        Connect Wallet
                    </Button>
                )}
            </>

            <Menu as='div' className='relative inline-block text-left'>
                <Menu.Button className='flex items-center gap-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1.5 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:px-3.5'>
                    <span className='relative flex h-2 w-2 items-center justify-center'>
                        <span className='absolute inline-flex h-2 w-2 rounded-full bg-success-500' />
                    </span>

                    <span className='hidden text-3 leading-3.5 text-neutral-900 desktop:inline desktop:text-3.5 desktop:leading-4.5'>
                        {currentLabel}
                    </span>

                    <ChevronDownIcon className='h-3.5 w-3.5 laptop:h-4 laptop:w-4' />
                </Menu.Button>

                <Menu.Items className='shadow-lg absolute right-0 z-10 mt-1 w-36 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    {Object.entries(NETWORK_SWITCH_LINKS).map(([key, href]) => {
                        const label =
                            key === 'mainnet' ? 'Mainnet' : 'Calibration';
                        const isCurrent = label === currentLabel;

                        return (
                            <Menu.Item key={key}>
                                {({ active }) => (
                                    <Link
                                        href={href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className={clsx(
                                            'flex w-full items-center px-4 py-2 text-sm text-neutral-900',
                                            {
                                                'bg-neutral-200': isCurrent,
                                                'bg-neutral-100':
                                                    !isCurrent && active,
                                            }
                                        )}
                                    >
                                        {label}
                                    </Link>
                                )}
                            </Menu.Item>
                        );
                    })}
                </Menu.Items>
            </Menu>

            <div className='hidden flex-row items-center gap-2 px-4 laptop:flex'>
                {(
                    [
                        [
                            CURRENCY,
                            ordinaryFormat(
                                Number(accountBalance.toString()),
                                0,
                                2,
                                'compact'
                            ),
                            FilecoinLogo,
                        ],
                        [
                            COIN,
                            ordinaryFormat(
                                Number(debtTokenBalance.toString()) || 0,
                                0,
                                2,
                                'compact'
                            ),
                            USDFCLogo,
                        ],
                        // [GT, Decimal.from(protocolTokenBalance)],
                    ] as const
                ).map(([currency, balance, Logo], i) => (
                    <div
                        className='flex flex-col gap-0.5 text-right text-3.5 leading-3.5 text-neutral-800'
                        key={i}
                    >
                        <div className='flex items-center gap-1'>
                            <Logo className='h-4 w-4' />
                            <span className='font-semibold'>{currency}</span>
                        </div>
                        <span>{isConnected ? balance : '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
