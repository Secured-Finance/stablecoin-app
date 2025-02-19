import { Button } from 'src/components/atoms';
import { GT } from '../../strings';
import { InfoMessage } from '../InfoMessage';
import { CardComponent } from '../templates';
import { useStakingView } from './context/StakingViewContext';

export const NoStake: React.FC = () => {
    const { dispatch } = useStakingView();

    return (
        <CardComponent
            title='Staking'
            actionComponent={
                <Button onClick={() => dispatch({ type: 'startAdjusting' })}>
                    Start staking
                </Button>
            }
        >
            <InfoMessage title={`You haven't staked ${GT} yet.`}>
                Stake {GT} to earn a share of borrowing and redemption fees.
            </InfoMessage>
        </CardComponent>
    );
};
