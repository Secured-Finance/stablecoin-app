import { Decimal, SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useEffect, useState } from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Box, Button, Card, Flex, Heading, Input, Label } from 'theme-ui';
import { Icon } from './Icon';
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
        <Card>
            <Heading>Price feed</Heading>

            <Box sx={{ p: ['12px', '12px'] }}>
                <Flex sx={{ alignItems: 'stretch' }}>
                    <Label>tFIL</Label>

                    <Label variant='unit'>$</Label>

                    <Input
                        type={canSetPrice ? 'number' : 'text'}
                        step='any'
                        value={editedPrice}
                        onChange={e => setEditedPrice(e.target.value)}
                        disabled={!canSetPrice}
                    />

                    {canSetPrice && (
                        <Flex sx={{ ml: 2, alignItems: 'center' }}>
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
                                <Button variant='icon'>
                                    <Icon name='chart-line' size='lg' />
                                </Button>
                            </Transaction>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Card>
    );
};
