import {
    Decimal,
    Decimalish,
    Difference,
    SfStablecoinStoreState,
    StabilityDeposit,
} from '@secured-finance/stablecoin-lib-base';
import React, { useState } from 'react';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COIN, CURRENCY } from '../../strings';
import { Icon } from '../Icon';
import { LoadingOverlay } from '../LoadingOverlay';
import { EditableRow, StaticRow } from '../Trove/Editor';

const select = ({
    debtTokenBalance,
    debtTokenInStabilityPool,
}: SfStablecoinStoreState) => ({
    debtTokenBalance,
    debtTokenInStabilityPool,
});

type StabilityDepositEditorProps = React.PropsWithChildren<{
    originalDeposit: StabilityDeposit;
    editedDebtToken: Decimal;
    changePending: boolean;
    dispatch: (
        action:
            | { type: 'setDeposit'; newValue: Decimalish }
            | { type: 'revert' }
    ) => void;
}>;

export const StabilityDepositEditor: React.FC<StabilityDepositEditorProps> = ({
    originalDeposit,
    editedDebtToken,
    changePending,
    dispatch,
    children,
}) => {
    const { debtTokenBalance, debtTokenInStabilityPool } =
        useSfStablecoinSelector(select);
    const editingState = useState<string>();

    const edited = !editedDebtToken.eq(originalDeposit.currentDebtToken);

    const maxAmount = originalDeposit.currentDebtToken.add(debtTokenBalance);
    const maxedOut = editedDebtToken.eq(maxAmount);

    const debtTokenInStabilityPoolAfterChange = debtTokenInStabilityPool
        .sub(originalDeposit.currentDebtToken)
        .add(editedDebtToken);

    const originalPoolShare = originalDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );
    const newPoolShare = editedDebtToken.mulDiv(
        100,
        debtTokenInStabilityPoolAfterChange
    );
    const poolShareChange =
        originalDeposit.currentDebtToken.nonZero &&
        Difference.between(newPoolShare, originalPoolShare).nonZero;

    return (
        <CardComponent
            title={
                <>
                    Stability Pool
                    {edited && !changePending && (
                        <button
                            onClick={() => dispatch({ type: 'revert' })}
                            className='item-right flex w-8 w-auto items-center px-2 hover:enabled:text-error-700'
                        >
                            <span className='typography-mobile-body-4 pr-1 font-semibold'>
                                Reset
                            </span>
                            <Icon name='history' size='sm' />
                        </button>
                    )}
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <EditableRow
                    label='Deposit'
                    inputId='deposit-scr'
                    amount={editedDebtToken.prettify()}
                    maxAmount={maxAmount.toString()}
                    maxedOut={maxedOut}
                    unit={COIN}
                    {...{ editingState }}
                    editedAmount={editedDebtToken.toString(2)}
                    setEditedAmount={newValue =>
                        dispatch({ type: 'setDeposit', newValue })
                    }
                />

                <div className='flex flex-col gap-3 px-3'>
                    {newPoolShare.infinite ? (
                        <StaticRow
                            label='Pool share'
                            inputId='deposit-share'
                            amount='N/A'
                        />
                    ) : (
                        <StaticRow
                            label='Pool share'
                            inputId='deposit-share'
                            amount={newPoolShare.prettify(4)}
                            pendingAmount={poolShareChange
                                ?.prettify(4)
                                .concat('%')}
                            pendingColor={
                                poolShareChange?.positive
                                    ? 'text-success-700'
                                    : 'text-error-700'
                            }
                            unit='%'
                        />
                    )}

                    {!originalDeposit.isEmpty && (
                        <>
                            <StaticRow
                                label='Liquidation gain'
                                inputId='deposit-gain'
                                amount={originalDeposit.collateralGain.prettify(
                                    4
                                )}
                                color={
                                    originalDeposit.collateralGain.nonZero &&
                                    'text-success-700'
                                }
                                unit={CURRENCY}
                            />

                            {/* <StaticRow
                            label='Reward'
                            inputId='deposit-reward'
                            amount={originalDeposit.protocolTokenReward.prettify()}
                            color={
                                originalDeposit.protocolTokenReward.nonZero &&
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
                        /> */}
                        </>
                    )}
                </div>
                {children}
            </div>
            {changePending && <LoadingOverlay />}
        </CardComponent>
    );
};
