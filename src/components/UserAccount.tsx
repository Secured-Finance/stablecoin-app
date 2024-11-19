import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Decimal, SfStablecoinStoreState } from '@secured-finance/lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ExternalLink from 'src/assets/icons/external-link.svg';
import GlobeIcon from 'src/assets/icons/globe-alt.svg';
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
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const changeLanguage = (newLang: string) => {
        // Extract the current pathname and hash
        const { hash } = location;
        const currentPath = window.location.pathname.replace(/^\/(zh|en)/, '');
        // Build the new URL with the language prefix
        const newPath = `/${newLang}${currentPath}`;
        // Update the browser URL
        window.history.replaceState(null, '', `${newPath}${hash}`);
        i18n.changeLanguage(newLang);
    };

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
                        {t('header.fixed-income')}
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
            <Menu>
                <MenuButton className='flex h-8 w-8 items-center justify-center rounded-[8px] ring-1 ring-neutral-300 hover:ring-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:w-10 laptop:rounded-[10px] laptop:ring-[1.5px]'>
                    <GlobeIcon className='h-4 w-4' />
                </MenuButton>
                <MenuItems
                    anchor='bottom'
                    className='z-10 mt-2 shadow-dropdown'
                >
                    <div className='typography-desktop-body-5 w-[200px] overflow-hidden rounded-md bg-neutral-50 pb-1.5 text-neutral-800'>
                        <div className='flex items-center justify-between border-b border-neutral-200 bg-white pb-[15px] pl-5 pr-4 pt-[13px]'>
                            <div className='flex items-center gap-2'>
                                <GlobeIcon className='h-5 w-5' /> Language
                            </div>
                            <ChevronDown className='h-4 w-4 text-neutral-400' />
                        </div>
                        <MenuItem>
                            <button
                                className='w-full border-b border-neutral-200 px-5 py-[11px] text-left hover:text-primary-500'
                                onClick={() => changeLanguage('en')}
                            >
                                English
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className='w-full px-5 py-[11px] text-left hover:text-primary-500'
                                onClick={() => changeLanguage('zh')}
                            >
                                Chinese (Simplified)
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
};
