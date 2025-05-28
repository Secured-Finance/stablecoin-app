import { useAccount } from 'wagmi';
import { FeatureCards } from './FeatureCard';
import { EmptyPositions } from './EmptyPositions';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoinSelector } from 'src/hooks';
import { Positions } from './Positions';
export function FeatureCardsOrPositions() {
    const select = ({
        debtTokenInStabilityPool,
        trove,
    }: SfStablecoinStoreState) => ({
        debtTokenInStabilityPool,
        trove,
    });
    const { debtTokenInStabilityPool, trove } = useSfStablecoinSelector(select);

    const { isConnected } = useAccount();

    // When wallet is not connected, show feature cards
    if (!isConnected) {
        return <FeatureCards />;
    }

    if (trove || debtTokenInStabilityPool) {
        return <Positions />;
    }

    // When wallet is connected but has no positions, show empty positions
    return <EmptyPositions />;
}
