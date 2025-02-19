import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React, { useCallback, useEffect } from 'react';
import { Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { COIN, CURRENCY } from '../../strings';
import { Icon } from '../Icon';
import { LoadingOverlay } from '../LoadingOverlay';
import { useMyTransactionState } from '../Transaction';
import { DisabledEditableRow, StaticRow } from '../Trove/Editor';
import { ClaimAndMove } from './actions/ClaimAndMove';
import { ClaimRewards } from './actions/ClaimRewards';
import { useStabilityView } from './context/StabilityViewContext';

const selector = ({
    stabilityDeposit,
    trove,
    debtTokenInStabilityPool,
}: SfStablecoinStoreState) => ({
    stabilityDeposit,
    trove,
    debtTokenInStabilityPool,
});

export const ActiveDeposit: React.FC = () => {
    const { dispatchEvent } = useStabilityView();
    const { stabilityDeposit, trove, debtTokenInStabilityPool } =
        useSfStablecoinSelector(selector);

    const poolShare = stabilityDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );

    const handleAdjustDeposit = useCallback(() => {
        dispatchEvent('ADJUST_DEPOSIT_PRESSED');
    }, [dispatchEvent]);

    // const hasReward = !stabilityDeposit.protocolTokenReward.isZero;
    const hasGain = !stabilityDeposit.collateralGain.isZero;
    const hasTrove = !trove.isEmpty;

    const transactionId = 'stability-deposit';
    const transactionState = useMyTransactionState(transactionId);
    const isWaitingForTransaction =
        transactionState.type === 'waitingForApproval' ||
        transactionState.type === 'waitingForConfirmation';

    useEffect(() => {
        if (transactionState.type === 'confirmedOneShot') {
            dispatchEvent('REWARDS_CLAIMED');
        }
    }, [transactionState.type, dispatchEvent]);

    return (
        <CardComponent
            title={
                <>
                    Stability Pool
                    {/* {!isWaitingForTransaction && (
                    <Flex sx={{ justifyContent: 'flex-end' }}>
                        <RemainingProtocolToken />
                    </Flex>
                )} */}
                </>
            }
            actionComponent={
                <>
                    <Button
                        variant={ButtonVariants.secondary}
                        onClick={handleAdjustDeposit}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;Adjust
                    </Button>

                    <ClaimRewards disabled={!hasGain}>
                        Claim {CURRENCY}
                    </ClaimRewards>
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <DisabledEditableRow
                    label='Deposit'
                    inputId='deposit-debt-token'
                    amount={stabilityDeposit.currentDebtToken.prettify()}
                    unit={COIN}
                />

                <div className='flex flex-col gap-3 px-3'>
                    <StaticRow
                        label='Pool share'
                        inputId='deposit-share'
                        amount={poolShare.prettify(4)}
                        unit='%'
                    />

                    <StaticRow
                        label='Liquidation gain'
                        inputId='deposit-gain'
                        amount={stabilityDeposit.collateralGain.prettify(
                            COLLATERAL_PRECISION
                        )}
                        color={
                            stabilityDeposit.collateralGain.nonZero &&
                            'text-success-700'
                        }
                        unit={CURRENCY}
                    />
                </div>
                {/* <Flex sx={{ alignItems: 'center' }}>
                        <StaticRow
                            label='Reward'
                            inputId='deposit-reward'
                            amount={stabilityDeposit.protocolTokenReward.prettify()}
                            color={
                                stabilityDeposit.protocolTokenReward.nonZero &&
                                'success'
                            }
                            unit={GT}
                            infoIcon={
                                <InfoIcon
                                    message={
                                        <Card
                                            variant='tooltip'
                                            sx={{ width: '240px' }}
                                        >
                                            Although the SCR rewards accrue
                                            every minute, the value on the UI
                                            only updates when a user transacts
                                            with the Stability Pool. Therefore
                                            you may receive more rewards than is
                                            displayed when you claim or adjust
                                            your deposit.
                                        </Card>
                                    }
                                />
                            }
                        />
                        <Flex
                            sx={{ justifyContent: 'flex-end', flexShrink: 0 }}
                        >
                            <Yield />
                        </Flex>
                    </Flex> */}
                {hasTrove && (
                    <ClaimAndMove disabled={!hasGain}>
                        Move {CURRENCY} to Trove
                    </ClaimAndMove>
                )}
            </div>
            {isWaitingForTransaction && <LoadingOverlay />}
        </CardComponent>
    );
};
