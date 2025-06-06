import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoinReducer, useSfStablecoinSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import { EmptyPositions, FeatureCards, Positions } from './molecules';
import { init, reduce } from './Stability/StabilityDepositManager';

export const FeatureCardsOrPositions = () => {
    const select = ({
        debtTokenInStabilityPool,
        trove,
        price,
    }: SfStablecoinStoreState) => ({
        debtTokenInStabilityPool,
        trove,
        price,
    });
    const { debtTokenInStabilityPool, trove, price } =
        useSfStablecoinSelector(select);

    const [{ originalDeposit }] = useSfStablecoinReducer(reduce, init);

    const { isConnected } = useAccount();

    // When wallet is not connected, show feature cards
    if (!isConnected) {
        return <FeatureCards />;
    }

    if (trove || debtTokenInStabilityPool) {
        return (
            <Positions
                debtTokenInStabilityPool={debtTokenInStabilityPool}
                trove={trove}
                price={price}
                originalDeposit={originalDeposit}
            />
        );
    }

    // When wallet is connected but has no positions, show empty positions
    return <EmptyPositions />;
};
