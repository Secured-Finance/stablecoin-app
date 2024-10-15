import { useStakingView } from './context/StakingViewContext';
import { NoStake } from './NoStake';
import { ReadOnlyStake } from './ReadOnlyStake';
import { StakingManager } from './StakingManager';

export const Staking: React.FC = () => {
    const { view } = useStakingView();

    switch (view) {
        case 'ACTIVE':
            return <ReadOnlyStake />;

        case 'ADJUSTING':
            return <StakingManager />;

        case 'NONE':
            return <NoStake />;
    }
};
