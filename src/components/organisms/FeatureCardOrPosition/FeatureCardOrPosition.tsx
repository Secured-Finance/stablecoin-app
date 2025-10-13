import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import {
    EmptyPositions,
    FeatureCards,
    Positions,
} from 'src/components/molecules';
import { TroveView } from 'src/components/Trove/context/types';

type FeatureCardsOrPositionsProps = {
    data: {
        isConnected: boolean;
        debtTokenInStabilityPool?: Decimal;
        trove?: Trove;
        price?: Decimal;
        originalDeposit?: {
            collateralGain: Decimal;
            currentDebtToken: Decimal;
        };
        troveView?: TroveView;
    };
    claimGainsButton?: React.ReactNode;
};

export const FeatureCardsOrPositions = ({
    data: {
        isConnected,
        debtTokenInStabilityPool,
        trove,
        price,
        originalDeposit,
        troveView,
    },
    claimGainsButton,
}: FeatureCardsOrPositionsProps) => {
    // When wallet is not connected, show feature cards
    if (!isConnected) {
        return <FeatureCards />;
    }

    if (trove || debtTokenInStabilityPool) {
        return (
            <Positions
                debtTokenInStabilityPool={
                    debtTokenInStabilityPool || Decimal.ZERO
                }
                trove={
                    trove ||
                    Trove.create({
                        borrowDebtToken: '0',
                        depositCollateral: '0',
                    })
                }
                price={price || Decimal.ZERO}
                originalDeposit={
                    originalDeposit || {
                        collateralGain: Decimal.ZERO,
                        currentDebtToken: Decimal.ZERO,
                    }
                }
                claimGainsButton={claimGainsButton}
                troveView={troveView}
            />
        );
    }

    // When wallet is connected but has no positions, show empty positions
    return <EmptyPositions />;
};
