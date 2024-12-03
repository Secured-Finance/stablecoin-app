/* eslint-disable no-console */
import {
    Decimal,
    Decimalish,
    SfStablecoinStoreState,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import React, { useCallback, useEffect } from 'react';
import { Button, ButtonVariants } from 'src/components/atoms';
import {
    SfStablecoinStoreUpdate,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { COIN } from '../../strings';
import { InfoBubble } from '../InfoBubble';
import { useMyTransactionState } from '../Transaction';
import { StabilityDepositAction } from './StabilityDepositAction';
import { StabilityDepositEditor } from './StabilityDepositEditor';
import { useStabilityView } from './context/StabilityViewContext';
import {
    selectForStabilityDepositChangeValidation,
    validateStabilityDepositChange,
} from './validation/validateStabilityDepositChange';

const init = ({ stabilityDeposit }: SfStablecoinStoreState) => ({
    originalDeposit: stabilityDeposit,
    editedDebtToken: stabilityDeposit.currentDebtToken,
    changePending: false,
});

type StabilityDepositManagerState = ReturnType<typeof init>;
type StabilityDepositManagerAction =
    | SfStablecoinStoreUpdate
    | { type: 'startChange' | 'finishChange' | 'revert' }
    | { type: 'setDeposit'; newValue: Decimalish };

const reduceWith =
    (action: StabilityDepositManagerAction) =>
    (state: StabilityDepositManagerState): StabilityDepositManagerState =>
        reduce(state, action);

const finishChange = reduceWith({ type: 'finishChange' });
const revert = reduceWith({ type: 'revert' });

const reduce = (
    state: StabilityDepositManagerState,
    action: StabilityDepositManagerAction
): StabilityDepositManagerState => {
    // console.log(state);
    // console.log(action);

    const { originalDeposit, editedDebtToken, changePending } = state;

    switch (action.type) {
        case 'startChange': {
            console.log('changeStarted');
            return { ...state, changePending: true };
        }

        case 'finishChange':
            return { ...state, changePending: false };

        case 'setDeposit':
            return { ...state, editedDebtToken: Decimal.from(action.newValue) };

        case 'revert':
            return {
                ...state,
                editedDebtToken: originalDeposit.currentDebtToken,
            };

        case 'updateStore': {
            const {
                stateChange: { stabilityDeposit: updatedDeposit },
            } = action;

            if (!updatedDeposit) {
                return state;
            }

            const newState = { ...state, originalDeposit: updatedDeposit };

            const changeCommitted =
                !updatedDeposit.initialDebtToken.eq(
                    originalDeposit.initialDebtToken
                ) ||
                updatedDeposit.currentDebtToken.gt(
                    originalDeposit.currentDebtToken
                ) ||
                updatedDeposit.collateralGain.lt(
                    originalDeposit.collateralGain
                ) ||
                updatedDeposit.protocolTokenReward.lt(
                    originalDeposit.protocolTokenReward
                );

            if (changePending && changeCommitted) {
                return finishChange(revert(newState));
            }

            return {
                ...newState,
                editedDebtToken: updatedDeposit.apply(
                    originalDeposit.whatChanged(editedDebtToken)
                ),
            };
        }
    }
};

const transactionId = 'stability-deposit';

export const StabilityDepositManager: React.FC = () => {
    const [{ originalDeposit, editedDebtToken, changePending }, dispatch] =
        useSfStablecoinReducer(reduce, init);
    const validationContext = useSfStablecoinSelector(
        selectForStabilityDepositChangeValidation
    );
    const { dispatchEvent } = useStabilityView();

    const handleCancel = useCallback(() => {
        dispatchEvent('CANCEL_PRESSED');
    }, [dispatchEvent]);

    const [validChange, description] = validateStabilityDepositChange(
        originalDeposit,
        editedDebtToken,
        validationContext
    );

    const makingNewDeposit = originalDeposit.isEmpty;

    const myTransactionState = useMyTransactionState(transactionId);

    useEffect(() => {
        if (
            myTransactionState.type === 'waitingForApproval' ||
            myTransactionState.type === 'waitingForConfirmation'
        ) {
            dispatch({ type: 'startChange' });
        } else if (
            myTransactionState.type === 'failed' ||
            myTransactionState.type === 'cancelled'
        ) {
            dispatch({ type: 'finishChange' });
        } else if (myTransactionState.type === 'confirmedOneShot') {
            dispatchEvent('DEPOSIT_CONFIRMED');
        }
    }, [myTransactionState.type, dispatch, dispatchEvent]);

    return (
        <StabilityDepositEditor
            originalDeposit={originalDeposit}
            editedDebtToken={editedDebtToken}
            changePending={changePending}
            dispatch={dispatch}
        >
            {description ??
                (makingNewDeposit ? (
                    <InfoBubble>
                        {t('card-component.deposit-instruction', { COIN })}
                    </InfoBubble>
                ) : (
                    <InfoBubble>
                        {t('card-component.adjust-amount', { COIN })}
                    </InfoBubble>
                ))}

            <div className='flex justify-end gap-2'>
                <Button
                    variant={ButtonVariants.tertiary}
                    onClick={handleCancel}
                >
                    {t('common.cancel')}
                </Button>

                {validChange ? (
                    <StabilityDepositAction
                        transactionId={transactionId}
                        change={validChange}
                    >
                        {t('common.confirm')}
                    </StabilityDepositAction>
                ) : (
                    <Button disabled>{t('common.confirm')}</Button>
                )}
            </div>
        </StabilityDepositEditor>
    );
};
