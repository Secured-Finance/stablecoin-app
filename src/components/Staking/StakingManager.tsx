import {
    Decimal,
    Decimalish,
    ProtocolTokenStake,
    ProtocolTokenStakeChange,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { Alert, Button, ButtonVariants } from 'src/components/atoms';
import {
    SfStablecoinStoreUpdate,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { COIN, CURRENCY, GT } from '../../strings';
import { ActionDescription, Amount } from '../ActionDescription';
import { useStakingView } from './context/StakingViewContext';
import { StakingEditor } from './StakingEditor';
import { StakingManagerAction } from './StakingManagerAction';

const init = ({ protocolTokenStake }: SfStablecoinStoreState) => ({
    originalStake: protocolTokenStake,
    editedProtocolToken: protocolTokenStake.stakedProtocolToken,
});

type StakeManagerState = ReturnType<typeof init>;
type StakeManagerAction =
    | SfStablecoinStoreUpdate
    | { type: 'revert' }
    | { type: 'setStake'; newValue: Decimalish };

const reduce = (
    state: StakeManagerState,
    action: StakeManagerAction
): StakeManagerState => {
    // console.log(state);
    // console.log(action);

    const { originalStake, editedProtocolToken } = state;

    switch (action.type) {
        case 'setStake':
            return {
                ...state,
                editedProtocolToken: Decimal.from(action.newValue),
            };

        case 'revert':
            return {
                ...state,
                editedProtocolToken: originalStake.stakedProtocolToken,
            };

        case 'updateStore': {
            const {
                stateChange: { protocolTokenStake: updatedStake },
            } = action;

            if (updatedStake) {
                return {
                    originalStake: updatedStake,
                    editedProtocolToken: updatedStake.apply(
                        originalStake.whatChanged(editedProtocolToken)
                    ),
                };
            }
        }
    }

    return state;
};

const selectProtocolTokenBalance = ({
    protocolTokenBalance,
}: SfStablecoinStoreState) => protocolTokenBalance;

type StakingManagerActionDescriptionProps = {
    originalStake: ProtocolTokenStake;
    change: ProtocolTokenStakeChange<Decimal>;
};

const StakingManagerActionDescription: React.FC<
    StakingManagerActionDescriptionProps
> = ({ originalStake, change }) => {
    const stakeProtocolToken = change.stakeProtocolToken
        ?.prettify()
        .concat(' ', GT);
    const unstakeProtocolToken = change.unstakeProtocolToken
        ?.prettify()
        .concat(' ', GT);
    const collateralGain = originalStake.collateralGain.nonZero
        ?.prettify(COLLATERAL_PRECISION)
        .concat(' ', CURRENCY);
    const debtTokenGain = originalStake.debtTokenGain.nonZero
        ?.prettify()
        .concat(' ', COIN);

    if (originalStake.isEmpty && stakeProtocolToken) {
        return (
            <ActionDescription>
                You are staking <Amount>{stakeProtocolToken}</Amount>.
            </ActionDescription>
        );
    }

    return (
        <ActionDescription>
            {stakeProtocolToken && (
                <>
                    You are adding <Amount>{stakeProtocolToken}</Amount> to your
                    stake
                </>
            )}
            {unstakeProtocolToken && (
                <>
                    You are withdrawing <Amount>{unstakeProtocolToken}</Amount>
                    to your wallet
                </>
            )}
            {(collateralGain || debtTokenGain) && (
                <>
                    {' '}
                    and claiming{' '}
                    {collateralGain && debtTokenGain ? (
                        <>
                            <Amount>{collateralGain}</Amount> and{' '}
                            <Amount>{debtTokenGain}</Amount>
                        </>
                    ) : (
                        <>
                            <Amount>{collateralGain ?? debtTokenGain}</Amount>
                        </>
                    )}
                </>
            )}
            .
        </ActionDescription>
    );
};

export const StakingManager: React.FC = () => {
    const { dispatch: dispatchStakingViewAction } = useStakingView();
    const [{ originalStake, editedProtocolToken }, dispatch] =
        useSfStablecoinReducer(reduce, init);
    const protocolTokenBalance = useSfStablecoinSelector(
        selectProtocolTokenBalance
    );

    const change = originalStake.whatChanged(editedProtocolToken);
    const [validChange, description] = !change
        ? [undefined, undefined]
        : change.stakeProtocolToken?.gt(protocolTokenBalance)
        ? [
              undefined,
              <Alert key={0}>
                  The amount you are trying to stake exceeds your balance by{' '}
                  <Amount>
                      {change.stakeProtocolToken
                          .sub(protocolTokenBalance)
                          .prettify()}{' '}
                      {GT}
                  </Amount>
                  .
              </Alert>,
          ]
        : [
              change,
              <StakingManagerActionDescription
                  originalStake={originalStake}
                  change={change}
                  key={1}
              />,
          ];

    const makingNewStake = originalStake.isEmpty;

    return (
        <StakingEditor
            title={'Staking'}
            {...{ originalStake, editedProtocolToken, dispatch }}
        >
            {description ??
                (makingNewStake ? (
                    <Alert color='info'>
                        Enter the amount of {GT} you would like to stake.
                    </Alert>
                ) : (
                    <Alert color='info'>
                        Adjust the {GT} amount to stake or withdraw.
                    </Alert>
                ))}

            <div className='flex justify-end gap-2'>
                <Button
                    variant={ButtonVariants.tertiary}
                    onClick={() =>
                        dispatchStakingViewAction({ type: 'cancelAdjusting' })
                    }
                >
                    Cancel
                </Button>

                {validChange ? (
                    <StakingManagerAction change={validChange}>
                        Confirm
                    </StakingManagerAction>
                ) : (
                    <Button disabled>Confirm</Button>
                )}
            </div>
        </StakingEditor>
    );
};
