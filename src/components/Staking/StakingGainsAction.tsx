import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Button } from 'theme-ui';
import { useTransactionFunction } from '../Transaction';

const selectProtocolTokenStake = ({
    protocolTokenStake,
}: SfStablecoinStoreState) => protocolTokenStake;

export const StakingGainsAction: React.FC = () => {
    const { sfStablecoin } = useSfStablecoin();
    const { collateralGain, debtTokenGain } = useSfStablecoinSelector(
        selectProtocolTokenStake
    );

    const [sendTransaction] = useTransactionFunction(
        'stake',
        sfStablecoin.send.withdrawGainsFromStaking.bind(sfStablecoin.send)
    );

    return (
        <Button
            onClick={sendTransaction}
            disabled={collateralGain.isZero && debtTokenGain.isZero}
        >
            Claim gains
        </Button>
    );
};
