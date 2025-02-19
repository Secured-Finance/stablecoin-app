import React, { useState } from 'react';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoin } from 'src/hooks';
import { Transaction } from './Transaction';

export const LiquidationManager: React.FC = () => {
    const {
        sfStablecoin: { send: sfStablecoin },
    } = useSfStablecoin();
    const [numberOfTrovesToLiquidate, setNumberOfTrovesToLiquidate] =
        useState('90');

    return (
        <CardComponent title='Liquidation'>
            <div className='typography-mobile-body-4 laptop:typography-desktop-body-3 flex items-center justify-stretch gap-2 text-neutral-800'>
                <span className='whitespace-nowrap'>Up to</span>

                <input
                    type='number'
                    min='1'
                    step='1'
                    value={numberOfTrovesToLiquidate}
                    onChange={e => setNumberOfTrovesToLiquidate(e.target.value)}
                    className='typography-desktop-body-3 h-10 min-w-[100px] rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2'
                />

                <span className='flex-1'>Troves</span>

                <Transaction
                    id='batch-liquidate'
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
                    <Button>Liquidate</Button>
                </Transaction>
            </div>
        </CardComponent>
    );
};
