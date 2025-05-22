import { useAccount } from 'wagmi';
import { FeatureCards } from './FeatureCard';
import { EmptyPositions } from './EmptyPositions';
export function FeatureCardsOrPositions() {
    const { isConnected } = useAccount();

    // When wallet is not connected, show feature cards
    if (!isConnected) {
        return <FeatureCards />;
    }

    // When wallet is connected but has no positions, show empty positions
    return <EmptyPositions />;
}
