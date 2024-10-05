import { LiquityStoreState } from '@secured-finance/lib-base';
import { useLiquity, useLiquitySelector } from 'src/hooks';
import { Button } from 'theme-ui';
import { useTransactionFunction } from '../Transaction';

const selectLQTYStake = ({ lqtyStake }: LiquityStoreState) => lqtyStake;

export const StakingGainsAction: React.FC = () => {
    const { liquity } = useLiquity();
    const { collateralGain, lusdGain } = useLiquitySelector(selectLQTYStake);

    const [sendTransaction] = useTransactionFunction(
        'stake',
        liquity.send.withdrawGainsFromStaking.bind(liquity.send)
    );

    return (
        <Button
            onClick={sendTransaction}
            disabled={collateralGain.isZero && lusdGain.isZero}
        >
            Claim gains
        </Button>
    );
};
