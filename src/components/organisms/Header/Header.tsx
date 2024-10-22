import { Decimal, LiquityStoreState } from '@secured-finance/lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import Wallet from 'src/assets/icons/wallet.svg';
import SFLogoLight from 'src/assets/img/logo-light.svg';
import SmallSFLogoLight from 'src/assets/img/small-logo.svg';
import { NavTab } from 'src/components/atoms';
import { useLiquitySelector } from 'src/hooks';
import { COIN, GT } from 'src/strings';
import { AddressUtils } from 'src/utils';
import { useAccount } from 'wagmi';
import { LINKS } from './constants';

const select = ({
    accountBalance,
    debtTokenBalance,
    lqtyBalance,
}: LiquityStoreState) => ({
    accountBalance,
    debtTokenBalance,
    lqtyBalance,
});

export const Header = () => {
    const { open } = useWeb3Modal();
    const { address } = useAccount();

    const { accountBalance, debtTokenBalance, lqtyBalance } =
        useLiquitySelector(select);

    return (
        <div className='relative'>
            <nav
                data-cy='header'
                className='h-14 w-full border-foreground bg-white dark:bg-black'
            >
                <div className='flex h-full flex-row items-center justify-between px-5'>
                    <div className='flex items-center gap-3'>
                        <Link href='/' className='flex pr-5'>
                            <SFLogoLight className='hidden h-4 w-40 laptop:flex' />
                            <SmallSFLogoLight className='flex h-[25px] w-7 laptop:hidden' />
                        </Link>
                        <div className='hidden h-full flex-row laptop:flex'>
                            {LINKS.map(link => (
                                <ItemLink
                                    key={link.text}
                                    text={link.text}
                                    link={link.link}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center gap-2.5'>
                        <Link
                            href='https://app.secured.finance'
                            className='flex items-center gap-1.5 rounded-[10px] border border-neutral-300 bg-transparent px-3.5 py-2.5 text-3.5 leading-4.5 text-neutral-900 hover:border-primary-500 active:bg-primary-300/30'
                            target='_blank'
                        >
                            Fixed income
                            <ArrowUpSquare />
                        </Link>
                        {address ? (
                            <button
                                className='flex items-center gap-1.5 rounded-[10px] border border-neutral-300 px-3.5 py-2.5 text-3 leading-4.5 text-neutral-900 hover:border-primary-500 active:bg-primary-300/30'
                                onClick={() => open()}
                            >
                                {AddressUtils.format(address, 6)}
                            </button>
                        ) : (
                            <button
                                className='flex items-center gap-1.5 rounded-[10px] border-[1.5px] border-neutral-300 px-3.5 py-2.5 text-3.5 leading-4.5 text-neutral-900'
                                onClick={() => open()}
                            >
                                Connect Wallet
                            </button>
                        )}
                        <div className='flex items-center gap-1'>
                            <Wallet className='h-5 w-5' />
                            <ul className='hidden items-center gap-1 laptop:flex '>
                                {(
                                    [
                                        ['tFIL', accountBalance],
                                        [
                                            COIN,
                                            Decimal.from(debtTokenBalance || 0),
                                        ],
                                        [GT, Decimal.from(lqtyBalance)],
                                    ] as const
                                ).map(([currency, balance], i) => (
                                    <li
                                        key={i}
                                        className='flex flex-col items-start gap-0.5 px-2 text-3.5 leading-[14px] text-neutral-800'
                                    >
                                        <span className='font-semibold'>
                                            {currency}
                                        </span>
                                        {balance.prettify()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

const ItemLink = ({ text, link }: { text: string; link: string }) => {
    const router = useRouter();

    return (
        <Link href={link} className='h-full'>
            <NavTab text={text} active={router.asPath === link} />
        </Link>
    );
};
