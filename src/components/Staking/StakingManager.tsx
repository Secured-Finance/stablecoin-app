import {
    Decimal,
    Decimalish,
    LiquityStoreState,
    LQTYStake,
    LQTYStakeChange,
} from '@secured-finance/lib-base';
import React from 'react';
import {
    LiquityStoreUpdate,
    useLiquityReducer,
    useLiquitySelector,
} from 'src/hooks';
import { Button, Flex } from 'theme-ui';
import { COIN, GT } from '../../strings';
import { ActionDescription, Amount } from '../ActionDescription';
import { ErrorDescription } from '../ErrorDescription';
import { InfoBubble } from '../InfoBubble';
import { useStakingView } from './context/StakingViewContext';
import { StakingEditor } from './StakingEditor';
import { StakingManagerAction } from './StakingManagerAction';

const init = ({ lqtyStake }: LiquityStoreState) => ({
    originalStake: lqtyStake,
    editedLQTY: lqtyStake.stakedLQTY,
});

type StakeManagerState = ReturnType<typeof init>;
type StakeManagerAction =
    | LiquityStoreUpdate
    | { type: 'revert' }
    | { type: 'setStake'; newValue: Decimalish };

const reduce = (
    state: StakeManagerState,
    action: StakeManagerAction
): StakeManagerState => {
    // console.log(state);
    // console.log(action);

    const { originalStake, editedLQTY } = state;

    switch (action.type) {
        case 'setStake':
            return { ...state, editedLQTY: Decimal.from(action.newValue) };

        case 'revert':
            return { ...state, editedLQTY: originalStake.stakedLQTY };

        case 'updateStore': {
            const {
                stateChange: { lqtyStake: updatedStake },
            } = action;

            if (updatedStake) {
                return {
                    originalStake: updatedStake,
                    editedLQTY: updatedStake.apply(
                        originalStake.whatChanged(editedLQTY)
                    ),
                };
            }
        }
    }

    return state;
};

const selectLQTYBalance = ({ lqtyBalance }: LiquityStoreState) => lqtyBalance;

type StakingManagerActionDescriptionProps = {
    originalStake: LQTYStake;
    change: LQTYStakeChange<Decimal>;
};

const StakingManagerActionDescription: React.FC<
    StakingManagerActionDescriptionProps
> = ({ originalStake, change }) => {
    const stakeLQTY = change.stakeLQTY?.prettify().concat(' ', GT);
    const unstakeLQTY = change.unstakeLQTY?.prettify().concat(' ', GT);
    const collateralGain = originalStake.collateralGain.nonZero
        ?.prettify(4)
        .concat(' tFIL');
    const debtTokenGain = originalStake.debtTokenGain.nonZero
        ?.prettify()
        .concat(' ', COIN);

    if (originalStake.isEmpty && stakeLQTY) {
        return (
            <ActionDescription>
                You are staking <Amount>{stakeLQTY}</Amount>.
            </ActionDescription>
        );
    }

    return (
        <ActionDescription>
            {stakeLQTY && (
                <>
                    You are adding <Amount>{stakeLQTY}</Amount> to your stake
                </>
            )}
            {unstakeLQTY && (
                <>
                    You are withdrawing <Amount>{unstakeLQTY}</Amount> to your
                    wallet
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
    const [{ originalStake, editedLQTY }, dispatch] = useLiquityReducer(
        reduce,
        init
    );
    const lqtyBalance = useLiquitySelector(selectLQTYBalance);

    const change = originalStake.whatChanged(editedLQTY);
    const [validChange, description] = !change
        ? [undefined, undefined]
        : change.stakeLQTY?.gt(lqtyBalance)
        ? [
              undefined,
              <ErrorDescription key={0}>
                  The amount you are trying to stake exceeds your balance by{' '}
                  <Amount>
                      {change.stakeLQTY.sub(lqtyBalance).prettify()} {GT}
                  </Amount>
                  .
              </ErrorDescription>,
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
            {...{ originalStake, editedLQTY, dispatch }}
        >
            {description ??
                (makingNewStake ? (
                    <InfoBubble>
                        Enter the amount of {GT} you would like to stake.
                    </InfoBubble>
                ) : (
                    <InfoBubble>
                        Adjust the {GT} amount to stake or withdraw.
                    </InfoBubble>
                ))}

            <Flex variant='layout.actions'>
                <Button
                    variant='cancel'
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
            </Flex>
        </StakingEditor>
    );
};
