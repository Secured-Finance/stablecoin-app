import { Decimal, SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useEffect, useState } from 'react';
import TrendingUpIcon from 'src/assets/icons/trending-up.svg';
import { CardComponent } from 'src/components/molecules';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Transaction } from './Transaction';

const selectPrice = ({ price }: SfStablecoinStoreState) => price;

export const PriceManager: React.FC = () => {
    const {
        sfStablecoin: {
            send: sfStablecoin,
            connection: { _priceFeedIsTestnet: canSetPrice },
        },
    } = useSfStablecoin();

    const price = useSfStablecoinSelector(selectPrice);
    const [editedPrice, setEditedPrice] = useState(price.toString(2));

    useEffect(() => {
        setEditedPrice(price.toString(2));
    }, [price]);

    return (
        <CardComponent title='Price feed'>
            <div className='flex items-center gap-2'>
                <div className='typography-desktop-body-5'>tFIL</div>

                <div className='typography-desktop-body-4 relative flex h-11 flex-1 items-center gap-1 overflow-hidden'>
                    <span className='absolute left-2 top-1/2 -translate-y-1/2'>
                        $
                    </span>
                    <input
                        type={canSetPrice ? 'number' : 'text'}
                        step='any'
                        value={editedPrice}
                        onChange={e => setEditedPrice(e.target.value)}
                        disabled={!canSetPrice}
                        className='h-full flex-1 rounded-lg border border-neutral-300 bg-neutral-50 py-2 pl-6 pr-3 font-semibold'
                    />
                </div>

                {canSetPrice && (
                    <div className='flex items-center'>
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
                            <button>
                                <TrendingUpIcon />
                            </button>
                        </Transaction>
                    </div>
                )}
            </div>
        </CardComponent>
    );
};
