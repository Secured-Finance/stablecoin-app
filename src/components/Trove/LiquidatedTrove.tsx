import { LiquityStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { useLiquitySelector } from 'src/hooks';
import { Box, Button, Card, Flex, Heading } from 'theme-ui';
import { CollateralSurplusAction } from '../CollateralSurplusAction';
import { InfoMessage } from '../InfoMessage';
import { useTroveView } from './context/TroveViewContext';

const select = ({ collateralSurplusBalance }: LiquityStoreState) => ({
    hasSurplusCollateral: !collateralSurplusBalance.isZero,
});

export const LiquidatedTrove: React.FC = () => {
    const { hasSurplusCollateral } = useLiquitySelector(select);
    const { dispatchEvent } = useTroveView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('OPEN_TROVE_PRESSED');
    }, [dispatchEvent]);

    return (
        <Card>
            <Heading>Trove</Heading>
            <Box sx={{ p: [2, 3] }}>
                <InfoMessage title='Your Trove has been liquidated.'>
                    {hasSurplusCollateral
                        ? 'Please reclaim your remaining collateral before opening a new Trove.'
                        : 'You can borrow USDSF by opening a Trove.'}
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
