import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React, { useCallback } from 'react';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COIN } from 'src/strings';
import { CollateralSurplusAction } from '../CollateralSurplusAction';
import { InfoMessage } from '../InfoMessage';
import { useTroveView } from './context/TroveViewContext';
import { useAccount } from 'wagmi';

const select = ({ collateralSurplusBalance }: SfStablecoinStoreState) => ({
    hasSurplusCollateral: !collateralSurplusBalance.isZero,
});

export const LiquidatedTrove: React.FC = () => {
    const { hasSurplusCollateral } = useSfStablecoinSelector(select);
    const { dispatchEvent } = useTroveView();
    const { isConnected } = useAccount();

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
                        <Button
                            disabled={!isConnected}
                            onClick={handleOpenTrove}
                        >
                            Open Trove
                        </Button>
                    )}
                </>
            }
        >
            <InfoMessage title='Your Trove has been liquidated.'>
                {hasSurplusCollateral
                    ? 'Please reclaim your remaining collateral before opening a new Trove.'
                    : `You can borrow ${COIN} by opening a Trove.`}
            </InfoMessage>
        </CardComponent>
    );
};
