import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSfStablecoinSelector } from 'src/hooks';
import { Button } from '../atoms';
import { CollateralSurplusAction } from '../CollateralSurplusAction';
import { InfoMessage } from '../InfoMessage';
import { CardComponent } from '../templates';
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
        <CardComponent
            title='Trove'
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
            <InfoMessage title={t('card-component.trove-redeemed')}>
                {hasSurplusCollateral
                    ? t('card-component.reclaim-collateral')
                    : t('card-component.borrow-instructions')}
            </InfoMessage>
        </CardComponent>
    );
};
