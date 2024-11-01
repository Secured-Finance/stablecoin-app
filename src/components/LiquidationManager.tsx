import React, { useState } from 'react';
import Trash from 'src/assets/icons/trash.svg';
import { useSfStablecoin } from 'src/hooks';
import { Transaction } from './Transaction';
import { CardComponent } from './templates';

export const LiquidationManager: React.FC = () => {
    const {
        sfStablecoin: { send: sfStablecoin },
    } = useSfStablecoin();
    const [numberOfTrovesToLiquidate, setNumberOfTrovesToLiquidate] =
        useState('90');

    return (
        <CardComponent title='Liquidate'>
            <div className='typography-mobile-body-4 laptop:typography-desktop-body-3 flex items-center justify-stretch gap-2 text-neutral-800'>
                <span>Up to</span>

                <input
                    type='number'
                    min='1'
                    step='1'
                    value={numberOfTrovesToLiquidate}
                    onChange={e => setNumberOfTrovesToLiquidate(e.target.value)}
                    className='typography-mobile-body-4 h-[38px] flex-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2'
                />

                <span>Troves</span>

                <Transaction
                    id='batch-liquidate'
                    tooltip='Liquidate'
                    tooltipPlacement='bottom'
                    send={overrides => {
                        if (!numberOfTrovesToLiquidate) {
                            throw new Error('Invalid number');
                        }
                        return sfStablecoin.liquidateUpTo(
                            parseInt(numberOfTrovesToLiquidate, 10),
                            overrides
                        );
                    }}
                >
                    <button>
                        <Trash className='h-6 w-6 text-error-500' />
                    </button>
                </Transaction>
            </div>
        </CardComponent>
    );
};
