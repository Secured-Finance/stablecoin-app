import {
    Decimal,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useEffect, useState } from 'react';
import {
    useSfStablecoin,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { useAccount } from 'wagmi';
import { USDFCIcon } from '../SecuredFinanceLogo';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';
import { useStabilityView } from './context/StabilityViewContext';
import { ActionButton } from './StabilityActionButton';
import { StabilityAmountInput } from './StabilityAmountInput';
import { init, reduce } from './StabilityDepositManager';
import { StabilityStats } from './StabilityStats';
import { TabSwitcher } from './TabSwitcher';
import {
    selectForStabilityDepositChangeValidation,
    validateStabilityDepositChange,
} from './validation/validateStabilityDepositChange';

export const StabilityManageView = () => {
    const { isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(
        'deposit'
    );
    const [withdrawAmountInput, setWithdrawAmountInput] = useState('');

    const [{ originalDeposit, editedDebtToken }, dispatch] =
        useSfStablecoinReducer(reduce, init);

    const validationContext = useSfStablecoinSelector(
        selectForStabilityDepositChangeValidation
    );
    const [validChange, description] = validateStabilityDepositChange(
        originalDeposit,
        editedDebtToken,
        validationContext
    );

    const getDisplayAmount = () => {
        if (activeTab === 'withdraw') {
            return withdrawAmountInput;
        }

        return editedDebtToken.isZero ? '' : editedDebtToken.prettify(2);
    };

    const displayAmount = getDisplayAmount();
    const setDepositAmount = (val: string) => {
        dispatch({ type: 'setDeposit', newValue: val });
    };

    const handleInputChange = (val: string) => {
        if (activeTab === 'withdraw') {
            setWithdrawAmountInput(val);
            const currentDeposit = originalDeposit.currentDebtToken;
            const withdrawAmount =
                val === '' ? Decimal.ZERO : Decimal.from(val);

            if (withdrawAmount.lte(currentDeposit)) {
                const newTotal = currentDeposit.sub(withdrawAmount);
                setDepositAmount(newTotal.toString());
            } else {
                // For invalid withdrawals, set to zero to maintain valid state
                // The UI will show the withdrawal amount, validation will show error
                setDepositAmount('0');
            }
        } else {
            setDepositAmount(val === '' ? '0' : val);
        }
    };

    const { dispatchEvent } = useStabilityView();
    const myTransactionState = useMyTransactionState('stability-deposit');

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
            dispatch({ type: 'finishChange' });
            // Reset fields after successful transaction
            setWithdrawAmountInput('');
            dispatch({ type: 'revert' });
        }
    }, [myTransactionState.type, dispatch, dispatchEvent]);

    useEffect(() => {
        dispatch({ type: 'revert' });
        setWithdrawAmountInput('');
    }, [activeTab, dispatch]);

    useEffect(() => {
        if (originalDeposit.isEmpty && activeTab === 'withdraw') {
            setActiveTab('deposit');
        }
    }, [originalDeposit.isEmpty, activeTab]);

    const selectBalances = ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    }: SfStablecoinStoreState) => ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    });

    const { debtTokenBalance, debtTokenInStabilityPool } =
        useSfStablecoinSelector(selectBalances);

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

    const liquidationGains = originalDeposit.collateralGain.prettify(2);

    // Compute action deltas for display (currently unused, kept for future UX variants)
    // const depositDelta = editedDebtToken.gt(originalDeposit.currentDebtToken)
    //     ? editedDebtToken.sub(originalDeposit.currentDebtToken)
    //     : Decimal.ZERO;
    // const withdrawDelta = originalDeposit.currentDebtToken.gt(editedDebtToken)
    //     ? originalDeposit.currentDebtToken.sub(editedDebtToken)
    //     : Decimal.ZERO;

    const isDepositOperation = validChange?.depositDebtToken !== undefined;

    const getButtonText = () => {
        if (myTransactionState.type === 'waitingForApproval')
            return 'Waiting for Approval...';
        if (myTransactionState.type === 'waitingForConfirmation')
            return 'Processing...';
        if (validChange)
            return isDepositOperation ? 'Deposit USDFC' : 'Withdraw USDFC';
        return activeTab === 'deposit' ? 'Deposit USDFC' : 'Withdraw USDFC';
    };

    const isButtonDisabled =
        !validChange ||
        myTransactionState.type === 'waitingForApproval' ||
        myTransactionState.type === 'waitingForConfirmation';

    const { config, sfStablecoin } = useSfStablecoin();
    const selectFrontendRegistered = ({ frontend }: SfStablecoinStoreState) =>
        frontend.status === 'registered';
    const frontendRegistered = useSfStablecoinSelector(
        selectFrontendRegistered
    );
    const frontendTag = frontendRegistered ? config.frontendTag : undefined;

    const [sendTransaction] = useTransactionFunction(
        myTransactionState.type,
        validChange?.depositDebtToken
            ? sfStablecoin.send.depositDebtTokenInStabilityPool.bind(
                  sfStablecoin.send,
                  validChange?.depositDebtToken,
                  frontendTag
              )
            : sfStablecoin.send.withdrawDebtTokenFromStabilityPool.bind(
                  sfStablecoin.send,
                  validChange?.withdrawDebtToken || 0
              )
    );

    const isDisabled =
        myTransactionState.type === 'waitingForApproval' ||
        myTransactionState.type === 'waitingForConfirmation' ||
        !isConnected;

    return (
        <>
            <h1 className='text-2xl mb-2 text-center font-bold'>
                {originalDeposit.isEmpty
                    ? 'Deposit USDFC into the Stability Pool'
                    : `Manage ${
                          activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'
                      }`}
            </h1>
            <p className='mb-8 text-center text-sm text-neutral-450'>
                {originalDeposit.isEmpty
                    ? 'Deposit USDFC to earn FIL rewards. The pool helps maintain system stability by covering liquidated debt, ensuring a balanced and secure ecosystem.'
                    : 'Adjust your Stability Pool deposit by adding more USDFC or withdrawing a portion or the full amount.'}
            </p>

            <StabilityStats
                originalDeposit={originalDeposit}
                originalPoolShare={originalPoolShare}
                liquidationGains={liquidationGains}
            />

            <TabSwitcher
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                disabled={isDisabled}
            />

            <StabilityAmountInput
                label={
                    originalDeposit.isEmpty || activeTab === 'deposit'
                        ? 'Deposit Amount'
                        : 'Withdraw Amount'
                }
                displayAmount={displayAmount}
                handleInputChange={handleInputChange}
                maxAmount={
                    activeTab === 'withdraw'
                        ? originalDeposit.currentDebtToken
                        : debtTokenBalance
                }
                disabled={isDisabled}
                currentBalance={debtTokenBalance}
                onMaxClick={() => {
                    if (activeTab === 'withdraw') {
                        const maxWithdraw = originalDeposit.currentDebtToken;
                        setWithdrawAmountInput(maxWithdraw.prettify(2));
                        setDepositAmount('0');
                    } else {
                        const maxTotalDeposit =
                            originalDeposit.currentDebtToken.add(
                                debtTokenBalance
                            );
                        dispatch({
                            type: 'setDeposit',
                            newValue: maxTotalDeposit.toString(),
                        });
                    }
                }}
            />

            {originalDeposit.isEmpty ? (
                <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <div className='mb-1 text-sm font-medium'>
                                Pool Share
                            </div>
                            <div className='max-w-[280px] text-xs text-neutral-450'>
                                Your percentage of the Stability Pool,
                                determining your share of liquidated collateral
                                and rewards.
                            </div>
                        </div>
                        <div className='text-base font-medium'>
                            {newPoolShare.prettify()}%
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className='mb-6 flex justify-between rounded-xl border border-neutral-9 bg-white p-4'>
                        <div>
                            <div className='mb-1 text-sm font-bold text-neutral-450'>
                                New Total Deposit
                            </div>
                            <div className='max-w-[280px] text-xs text-neutral-450'>
                                Your updated deposit amount in the Stability
                                Pool after this transaction.
                            </div>
                        </div>
                        <div className='mt-2 flex gap-1 text-base font-medium'>
                            {validChange?.depositDebtToken
                                ? validChange.depositDebtToken.prettify()
                                : validChange?.withdrawDebtToken
                                ? originalDeposit.currentDebtToken
                                      .sub(validChange.withdrawDebtToken)
                                      .prettify()
                                : editedDebtToken.prettify()}{' '}
                            <USDFCIcon />
                        </div>
                    </div>

                    <div className='mb-6 flex justify-between rounded-xl border border-neutral-9 bg-white p-4'>
                        <div>
                            <div className='mb-1 text-sm font-bold text-neutral-450'>
                                New Pool Share
                            </div>
                            <div className='max-w-[280px] text-xs text-neutral-450'>
                                Your percentage of the Stability Pool after this
                                transaction, determining your share of
                                liquidated collateral and rewards.
                            </div>
                        </div>
                        <div className='mt-2 text-base font-medium'>
                            {newPoolShare.prettify()}%
                        </div>
                    </div>
                </>
            )}

            <ActionButton
                validChange={validChange}
                isDisabled={isButtonDisabled}
                getButtonText={getButtonText}
                onClick={sendTransaction}
                activeTab={activeTab}
            />

            {!isConnected && (
                <p className='text-center text-xs text-neutral-450'>
                    This action will open your wallet to sign the transaction.
                </p>
            )}

            {description}
        </>
    );
};
