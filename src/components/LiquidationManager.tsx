import React, { useState } from 'react';
import { useSfStablecoin } from 'src/hooks';
import { Button, Flex, Input, Label } from 'theme-ui';
import { Icon } from './Icon';
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
            <Flex sx={{ alignItems: 'stretch' }}>
                <Label>Up to</Label>

                <Input
                    type='number'
                    min='1'
                    step='1'
                    value={numberOfTrovesToLiquidate}
                    onChange={e => setNumberOfTrovesToLiquidate(e.target.value)}
                />

                <Label>Troves</Label>

                <Flex sx={{ ml: 2, alignItems: 'center' }}>
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
                        <Button variant='dangerIcon'>
                            <Icon name='trash' size='lg' />
                        </Button>
                    </Transaction>
                </Flex>
            </Flex>
        </CardComponent>
    );
};
