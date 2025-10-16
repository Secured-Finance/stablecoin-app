import {
    Decimal,
    Percent,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Card, Spinner } from 'theme-ui';
import { useAccount } from 'wagmi';
import { COIN, CURRENCY } from '../../strings';
import { InfoIcon } from '../InfoIcon';
import { LoadingOverlay } from '../LoadingOverlay';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';
import { DisabledEditableRow, EditableRow, StaticRow } from '../Trove/Editor';
import {
    selectForRedemptionChangeValidation,
    validateRedemptionChange,
} from './validation/validateRedemptionChange';

const transactionId = 'redeem';

const selector = (state: SfStablecoinStoreState) => {
    const { fees, debtTokenBalance, price } = state;
    return {
        fees,
        debtTokenBalance,
        price,
        validationContext: selectForRedemptionChangeValidation(state),
    };
};

export const Redemption: React.FC = ({}) => {
    const { fees, debtTokenBalance, price, validationContext } =
        useSfStablecoinSelector(selector);

    const { sfStablecoin } = useSfStablecoin();
    const { isConnected } = useAccount();
    const [debtToken, setDebtToken] = useState<Decimal>(Decimal.from(0));
    const [estimatedDebtToken, setEstimatedDebtToken] = useState<Decimal>(
        Decimal.from(0)
    );
    const [changePending, setChangePending] = useState<boolean>(false);
    const [hintsPending, setHintsPending] = useState<boolean>(false);
    const editingState = useState<string>();
    const [sendTransaction] = useTransactionFunction(
        transactionId,
        sfStablecoin.send.redeemDebtToken.bind(
            sfStablecoin.send,
            debtToken,
            undefined
        )
    );

    const maxAmount = debtTokenBalance;
    const maxedOut = debtToken.eq(maxAmount);
    const redemptionRate = fees.redemptionRate();
    const feePct = new Percent(redemptionRate);
    const fee = estimatedDebtToken.mul(redemptionRate).div(price);

    const [isValid, description] = validateRedemptionChange(
        debtToken,
        estimatedDebtToken,
        hintsPending,
        fee,
        validationContext
    );

    const myTransactionState = useMyTransactionState(transactionId);

    useEffect(() => {
        if (
            myTransactionState.type === 'waitingForApproval' ||
            myTransactionState.type === 'waitingForConfirmation'
        ) {
            setChangePending(true);
        } else if (myTransactionState.type === 'failed') {
            setChangePending(false);
        } else {
            setChangePending(false);
            setDebtToken(Decimal.from(0));
        }
    }, [myTransactionState.type, setChangePending]);

    useEffect(() => {
        if (debtToken.isZero) {
            setEstimatedDebtToken(Decimal.from(0));
            return;
        }

        setHintsPending(true);

        const timeoutId = setTimeout(async () => {
            const hints = await sfStablecoin.findRedemptionHints(debtToken);
            setEstimatedDebtToken(hints[0]);
            setHintsPending(false);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            setHintsPending(false);
        };
    }, [debtToken, sfStablecoin]);

    return (
        <CardComponent title='Redemption'>
            <div className='flex flex-col gap-3'>
                {isConnected ? (
                    <EditableRow
                        label='Redeem'
                        inputId='redeem-scr'
                        amount={debtToken.prettify()}
                        maxAmount={maxAmount.toString()}
                        maxedOut={maxedOut}
                        unit={COIN}
                        {...{ editingState }}
                        editedAmount={debtToken.toString(2)}
                        setEditedAmount={amount =>
                            setDebtToken(Decimal.from(amount))
                        }
                    />
                ) : (
                    <DisabledEditableRow
                        label='Redeem'
                        inputId='redeem-scr'
                        amount={debtToken.prettify()}
                        unit={COIN}
                    />
                )}
                <div className='flex flex-col gap-3 px-3'>
                    <StaticRow
                        label='Redemption Fee'
                        inputId='redemption-fee'
                        amount={fee.prettify(2)}
                        pendingAmount={feePct.toString(2)}
                        unit={CURRENCY}
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '240px' }}
                                    >
                                        The Redemption Fee is charged as a
                                        percentage of the redeemed {CURRENCY}.
                                        The Redemption Fee depends on {COIN}{' '}
                                        redemption volumes and is 0.5% at
                                        minimum.
                                    </Card>
                                }
                            />
                        }
                    />
                </div>
                <div className='mt-6'>{description}</div>
                <div className='mt-6 flex justify-end gap-2'>
                    {hintsPending ? (
                        <Button disabled>
                            <Spinner
                                sx={{ mx: 18, color: 'white' }}
                                size={18}
                            />
                        </Button>
                    ) : isValid ? (
                        <Button
                            disabled={!isConnected}
                            onClick={sendTransaction}
                        >
                            Confirm
                        </Button>
                    ) : (
                        <Button disabled>Confirm</Button>
                    )}
                </div>
            </div>
            {changePending && <LoadingOverlay />}
        </CardComponent>
    );
};
