import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { Button, ButtonVariants } from 'src/components/atoms';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { COIN, CURRENCY, GT } from '../../strings';
import { Icon } from '../Icon';
import { LoadingOverlay } from '../LoadingOverlay';
import { CardComponent } from '../templates';
import { DisabledEditableRow, StaticRow } from '../Trove/Editor';
import { useStakingView } from './context/StakingViewContext';
import { StakingGainsAction } from './StakingGainsAction';

const select = ({
    protocolTokenStake,
    totalStakedProtocolToken,
}: SfStablecoinStoreState) => ({
    protocolTokenStake,
    totalStakedProtocolToken,
});

export const ReadOnlyStake: React.FC = () => {
    const { changePending, dispatch } = useStakingView();
    const { protocolTokenStake, totalStakedProtocolToken } =
        useSfStablecoinSelector(select);

    const poolShare = protocolTokenStake.stakedProtocolToken.mulDiv(
        100,
        totalStakedProtocolToken
    );

    return (
        <CardComponent
            title='Staking'
            actionComponent={
                <>
                    <Button
                        variant={ButtonVariants.secondary}
                        onClick={() => dispatch({ type: 'startAdjusting' })}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;Adjust
                    </Button>

                    <StakingGainsAction />
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <DisabledEditableRow
                    label='Stake'
                    inputId='stake-scr'
                    amount={protocolTokenStake.stakedProtocolToken.prettify()}
                    unit={GT}
                />

                <StaticRow
                    label='Pool share'
                    inputId='stake-share'
                    amount={poolShare.prettify(4)}
                    unit='%'
                />

                <StaticRow
                    label='Redemption gain'
                    inputId='stake-gain-eth'
                    amount={protocolTokenStake.collateralGain.prettify(
                        COLLATERAL_PRECISION
                    )}
                    color={
                        protocolTokenStake.collateralGain.nonZero &&
                        'text-success-700'
                    }
                    unit={CURRENCY}
                />

                <StaticRow
                    label='Issuance gain'
                    inputId='stake-gain-debt-token'
                    amount={protocolTokenStake.debtTokenGain.prettify()}
                    color={
                        protocolTokenStake.debtTokenGain.nonZero &&
                        'text-success-700'
                    }
                    unit={COIN}
                />
            </div>

            {changePending && <LoadingOverlay />}
        </CardComponent>
    );
};
