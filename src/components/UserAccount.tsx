import { Decimal, LiquityStoreState } from '@secured-finance/lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import React from 'react';
import Wallet from 'src/assets/icons/wallet.svg';
import MetamaskLogo from 'src/assets/img/metamask-fox.svg';
import { useLiquity, useLiquitySelector } from 'src/hooks';
import { COIN, GT } from 'src/strings';
import { AddressUtils } from 'src/utils';

const select = ({
    accountBalance,
    debtTokenBalance,
    lqtyBalance,
}: LiquityStoreState) => ({
    accountBalance,
    debtTokenBalance,
    lqtyBalance,
});

export const UserAccount: React.FC = () => {
    const { account } = useLiquity();
    const { open } = useWeb3Modal();
    const { accountBalance, debtTokenBalance, lqtyBalance } =
        useLiquitySelector(select);

    return (
        <div className='flex flex-row items-center gap-3 tablet:flex-row-reverse tablet:gap-3'>
            <div className='flex flex-row items-center gap-1 tablet:px-2'>
                <Wallet className='h-4 w-4 tablet:h-5 tablet:w-5' />
                {(
                    [
                        ['tFIL', accountBalance],
                        [COIN, Decimal.from(debtTokenBalance || 0)],
                        [GT, Decimal.from(lqtyBalance)],
                    ] as const
                ).map(([currency, balance], i) => (
                    <div
                        className='flex flex-col gap-[2px] px-1 tablet:px-2'
                        key={i}
                    >
                        <span className='text-2.5 font-semibold leading-3.5 text-neutral-800'>
                            {currency}
                        </span>
                        <span className='text-2.5 leading-3.5 text-neutral-800'>
                            {balance.prettify()}
                        </span>
                    </div>
                ))}
            </div>
            <button
                className='flex h-8 items-center gap-x-1 rounded-lg p-2 ring-1 ring-neutral-300 focus:outline-none tablet:h-10 tablet:gap-x-1.5 tablet:rounded-xl tablet:p-3 tablet:ring-[1.5px]'
                onClick={() => open()}
            >
                <span>
                    <MetamaskLogo className='h-3.5 w-3.5 tablet:h-4 tablet:w-4' />
                </span>
                <span
                    className='tablet:typography-desktop-body-5 hidden text-neutral-900 tablet:block'
                    data-cy='wallet-address'
                >
                    {AddressUtils.format(account.toLowerCase(), 6)}
                </span>
            </button>
        </div>
    );
};
