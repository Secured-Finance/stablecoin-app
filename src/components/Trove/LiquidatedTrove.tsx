import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { CollateralSurplusAction } from '../CollateralSurplusAction';
import { InfoMessage } from '../InfoMessage';
import { useTroveView } from './context/TroveViewContext';

const select = ({ collateralSurplusBalance }: SfStablecoinStoreState) => ({
    hasSurplusCollateral: !collateralSurplusBalance.isZero,
});

export const LiquidatedTrove: React.FC = () => {
    const { hasSurplusCollateral } = useSfStablecoinSelector(select);
    const { dispatchEvent } = useTroveView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('OPEN_TROVE_PRESSED');
    }, [dispatchEvent]);

    const { t } = useTranslation();

    return (
        <CardComponent
            title={t('common.trove')}
            actionComponent={
                <>
                    {hasSurplusCollateral && <CollateralSurplusAction />}
                    {!hasSurplusCollateral && (
                        <Button onClick={handleOpenTrove}>
                            {t('common.open-trove')}
                        </Button>
                    )}
                </>
            }
        >
            <InfoMessage title={t('card-component.trove-liquidated')}>
                {hasSurplusCollateral
                    ? t('card-component.reclaim-collateral')
                    : t('card-component.borrow-instructions')}
            </InfoMessage>
        </CardComponent>
    );
};
