import { Decimal, SfStablecoinStoreState } from '@secured-finance/lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { t } from 'i18next';
import Link from 'next/link';
import React from 'react';
import ExternalLink from 'src/assets/icons/external-link.svg';
import Wallet from 'src/assets/icons/wallet.svg';
import { Identicon } from 'src/components/atoms';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { COIN } from 'src/strings';
import { AddressUtils } from 'src/utils';

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
    const { account } = useSfStablecoin();
    const { open } = useWeb3Modal();
    const { accountBalance, debtTokenBalance } =
        useSfStablecoinSelector(select);

    return (
        <div className='flex flex-row items-center gap-2'>
            <Link
                href={'https://app.secured.finance/'}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Fixed Income'
            >
                <div className='flex h-8 items-center gap-x-1.5 rounded-[8px] bg-neutral-50 px-2 ring-1 ring-neutral-300 hover:ring-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:rounded-[10px] laptop:px-3.5 laptop:ring-[1.5px]'>
                    <span className='text-3 leading-5 text-neutral-900 laptop:text-3.5 laptop:leading-4.5'>
                        {t('common.fixed-income')}
                    </span>
                    <ExternalLink className='h-4 w-4' />
                </div>
            </Link>
            <button
                className='flex h-8 items-center gap-x-1 rounded-[8px] px-2 ring-1 ring-neutral-300 hover:ring-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:gap-x-1.5 laptop:rounded-[10px] laptop:px-3.5 laptop:ring-[1.5px]'
                onClick={() => open()}
            >
                <span>
                    <Identicon value={account.toLowerCase()} size={16} />
                </span>
                <span
                    className='typography-desktop-body-5 hidden text-neutral-900 laptop:block'
                    data-cy='wallet-address'
                >
                    {AddressUtils.format(account.toLowerCase(), 6)}
                </span>
            </button>
            <div className='hidden flex-row items-center gap-1 px-2 laptop:flex'>
                <Wallet className='h-5 w-5' />
                {(
                    [
                        ['tFIL', accountBalance],
                        [COIN, Decimal.from(debtTokenBalance || 0)],
                        // [GT, Decimal.from(protocolTokenBalance)],
                    ] as const
                ).map(([currency, balance], i) => (
                    <div
                        className='flex flex-col gap-0.5 px-2 text-3.5 leading-3.5 text-neutral-800'
                        key={i}
                    >
                        <span className='font-semibold'>{currency}</span>
                        <span>{balance.prettify()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
