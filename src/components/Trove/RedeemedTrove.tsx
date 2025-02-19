import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React, { useCallback } from 'react';
import { Button } from 'src/components/atoms';
import { useSfStablecoinSelector } from 'src/hooks';
import { COIN } from 'src/strings';
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

    return (
        <CardComponent
            title='Trove'
            actionComponent={
                <>
                    {hasSurplusCollateral && <CollateralSurplusAction />}
                    {!hasSurplusCollateral && (
                        <Button onClick={handleOpenTrove}>Open Trove</Button>
                    )}
                </>
            }
        >
            <InfoMessage title='Your Trove has been redeemed.'>
                {hasSurplusCollateral
                    ? 'Please reclaim your remaining collateral before opening a new Trove.'
                    : `You can borrow ${COIN} by opening a Trove.`}
            </InfoMessage>
        </CardComponent>
    );
};
