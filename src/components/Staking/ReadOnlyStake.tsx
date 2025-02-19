import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { Box, Button, Card, Flex, Heading } from 'theme-ui';
import { COIN, CURRENCY, GT } from '../../strings';
import { Icon } from '../Icon';
import { LoadingOverlay } from '../LoadingOverlay';
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
        <Card>
            <Heading>Staking</Heading>

            <Box sx={{ p: [2, 3] }}>
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

                <Flex variant='layout.actions'>
                    <Button
                        variant='outline'
                        onClick={() => dispatch({ type: 'startAdjusting' })}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;Adjust
                    </Button>

                    <StakingGainsAction />
                </Flex>
            </Box>

            {changePending && <LoadingOverlay />}
        </Card>
    );
};
