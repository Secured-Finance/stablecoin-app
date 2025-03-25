import {
    Decimal,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import TrendingUpIcon from 'src/assets/icons/trending-up.svg';
import { CardComponent } from 'src/components/templates';
import { PYTH_ORACLE_LINK, TELLOR_ORACLE_LINKS } from 'src/constants';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { getSetPriceEnabled } from 'src/utils';
import { useAccount } from 'wagmi';
import { Transaction } from './Transaction';

const selectPrice = ({ price }: SfStablecoinStoreState) => price;

export const PriceManager: React.FC = () => {
    const {
        sfStablecoin: {
            send: sfStablecoin,
            connection: { _priceFeedIsTestnet, chainId },
        },
    } = useSfStablecoin();

    const canSetPrice = _priceFeedIsTestnet && getSetPriceEnabled();
    const { isConnected } = useAccount();

    const price = useSfStablecoinSelector(selectPrice);
    const [editedPrice, setEditedPrice] = useState(price.toString(2));

    useEffect(() => {
        setEditedPrice(price.toString(2));
    }, [price]);

    return (
        <CardComponent title='Price feed'>
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2 font-semibold'>
                    {canSetPrice ? (
                        <>
                            <div className='typography-desktop-body-5'>
                                {CURRENCY}
                            </div>
                            <div
                                className={clsx(
                                    `typography-desktop-body-4 relative flex h-11 flex-1 items-center gap-1 overflow-hidden`,
                                    { 'text-neutral-400': !isConnected }
                                )}
                            >
                                <span className='absolute left-2 top-1/2 -translate-y-1/2 leading-normal'>
                                    $
                                </span>
                                <input
                                    type='number'
                                    step='any'
                                    value={editedPrice}
                                    disabled={!isConnected}
                                    onChange={e =>
                                        setEditedPrice(e.target.value)
                                    }
                                    className={`h-full flex-1 rounded-md border border-neutral-300 bg-neutral-50 py-2 pl-6 pr-3 font-semibold focus:border-primary-500 focus:outline-none`}
                                />
                            </div>
                        </>
                    ) : (
                        <span className='typography-desktop-body-4 flex h-full flex-1 items-center bg-neutral-50 text-neutral-900'>
                            {`1 ${CURRENCY} = ${editedPrice} USD`}
                        </span>
                    )}
                    {canSetPrice && (
                        <div
                            className={clsx('flex items-center', {
                                'opacity-50': !isConnected,
                            })}
                        >
                            <Transaction
                                id='set-price'
                                tooltip='Set'
                                tooltipPlacement='bottom'
                                send={overrides => {
                                    if (!editedPrice) {
                                        throw new Error('Invalid price');
                                    }
                                    return sfStablecoin.setPrice(
                                        Decimal.from(editedPrice),
                                        overrides
                                    );
                                }}
                            >
                                <button disabled={!isConnected}>
                                    <TrendingUpIcon />
                                </button>
                            </Transaction>
                        </div>
                    )}
                </div>
                {!canSetPrice && (
                    <div className='text-2.5 leading-3.5 text-neutral-600'>
                        <span>Source:</span>
                        <Link
                            className='mx-1 font-semibold text-primary-500'
                            href={PYTH_ORACLE_LINK}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='Pyth'
                        >
                            Pyth
                        </Link>
                        |
                        <Link
                            className='mx-1 font-semibold text-primary-500'
                            href={
                                chainId === 314
                                    ? TELLOR_ORACLE_LINKS.mainnet
                                    : TELLOR_ORACLE_LINKS.testnet
                            }
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='Tellor'
                        >
                            Tellor
                        </Link>
                    </div>
                )}
            </div>
        </CardComponent>
    );
};
