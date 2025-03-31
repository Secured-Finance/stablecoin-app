import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import ExternalLink from 'src/assets/icons/external-link.svg';
import FilecoinLogo from 'src/assets/icons/filecoin-network.svg';
import USDFCLogo from 'src/assets/img/usdfc-logo-small.svg';
import { Button, ButtonSizes, Identicon } from 'src/components/atoms';
import {
    useBreakpoint,
    useSfStablecoin,
    useSfStablecoinSelector,
} from 'src/hooks';
import { COIN, CURRENCY } from 'src/strings';
import {
    AddressUtils,
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
                    <div className='flex items-center gap-x-1.5 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 hover:border-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:px-3.5'>
                        <span className='text-3 leading-4 text-neutral-900 laptop:text-3.5 laptop:leading-4.5'>
                            Fixed Income
                        </span>
                        <ExternalLink className='h-4 w-4' />
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
                                size={16}
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
