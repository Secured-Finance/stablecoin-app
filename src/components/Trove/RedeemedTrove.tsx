import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React, { useCallback } from 'react';
import { useSfStablecoinSelector } from 'src/hooks';
import { Box, Button, Card, Flex, Heading } from 'theme-ui';
import { CollateralSurplusAction } from '../CollateralSurplusAction';
import { InfoMessage } from '../InfoMessage';
import { useTroveView } from './context/TroveViewContext';

const select = ({ collateralSurplusBalance }: SfStablecoinStoreState) => ({
    hasSurplusCollateral: !collateralSurplusBalance.isZero,
});

export const RedeemedTrove: React.FC = () => {
    const { hasSurplusCollateral } = useSfStablecoinSelector(select);
    const { dispatchEvent } = useTroveView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('OPEN_TROVE_PRESSED');
    }, [dispatchEvent]);

    return (
        <Card>
            <Heading>Trove</Heading>
            <Box sx={{ p: [2, 3] }}>
                <InfoMessage title='Your Trove has been redeemed.'>
                    {hasSurplusCollateral
                        ? 'Please reclaim your remaining collateral before opening a new Trove.'
                        : 'You can borrow USDFC by opening a Trove.'}
                </InfoMessage>

                <Flex variant='layout.actions'>
                    {hasSurplusCollateral && <CollateralSurplusAction />}
                    {!hasSurplusCollateral && (
                        <Button onClick={handleOpenTrove}>Open Trove</Button>
                    )}
                </Flex>
            </Box>
        </Card>
    );
};
