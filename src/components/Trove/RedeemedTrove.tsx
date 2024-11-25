import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

    const { t } = useTranslation();

    return (
        <Card>
            <Heading>Trove</Heading>
            <Box sx={{ p: [2, 3] }}>
                <InfoMessage title={t('card-component.trove-redeemed')}>
                    {hasSurplusCollateral
                        ? t('card-component.reclaim-collateral')
                        : t('card-component.borrow-instructions')}
                </InfoMessage>

                <Flex variant='layout.actions'>
                    {hasSurplusCollateral && <CollateralSurplusAction />}
                    {!hasSurplusCollateral && (
                        <Button onClick={handleOpenTrove}>
                            {t('common.open-trove')}
                        </Button>
                    )}
                </Flex>
            </Box>
        </Card>
    );
};
