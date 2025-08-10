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
            const currentDeposit = originalDeposit.currentDebtToken;
            const newTotal = editedDebtToken;
            if (newTotal.gt(currentDeposit)) return '0';
            return currentDeposit.sub(newTotal).toString();
        }
        return editedDebtToken.prettify();
    };

    const displayAmount = getDisplayAmount();
    const setDepositAmount = (val: string) => {
        dispatch({ type: 'setDeposit', newValue: val });
    };

    const handleInputChange = (val: string) => {
        if (activeTab === 'withdraw') {
            const currentDeposit = originalDeposit.currentDebtToken;
            const withdrawAmount =
                val === '' ? Decimal.ZERO : Decimal.from(val);
            const newTotal = currentDeposit.sub(withdrawAmount);
            setDepositAmount(newTotal.toString());
        } else {
            setDepositAmount(val);
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
        }
    }, [myTransactionState.type, dispatch, dispatchEvent]);

    const selectBalances = ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    }: SfStablecoinStoreState) => ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    });

    const { debtTokenBalance, debtTokenInStabilityPool } =
        useSfStablecoinSelector(selectBalances);

    const maxAmount = originalDeposit.currentDebtToken.add(debtTokenBalance);

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
        myTransactionState.type === 'waitingForConfirmation';

    return (
        <>
            <h1 className='text-2xl mb-2 text-center font-bold'>
                Manage {activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </h1>
            <p className='mb-8 text-center text-sm text-[#565656]'>
                Adjust your Stability Pool deposit by adding more USDFC or
                withdrawing a portion or the full amount.
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
                    activeTab === 'deposit'
                        ? 'Deposit Amount'
                        : 'Withdraw Amount'
                }
                displayAmount={displayAmount}
                handleInputChange={handleInputChange}
                maxAmount={maxAmount}
                disabled={isDisabled}
                onMaxClick={() => setDepositAmount(maxAmount.toString())}
            />

            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                <div className='mb-1 text-sm text-[#565656]'>
                    New Total Deposit
                </div>
                <div className='gap-1 text-base font-medium'>
                    {editedDebtToken.prettify()} USDFC
                </div>
            </div>

            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                <div className='mb-1 text-sm text-[#565656]'>
                    New Pool Share
                </div>
                <div className='text-base font-medium'>
                    {newPoolShare.prettify()}%
                </div>
            </div>

            <ActionButton
                validChange={validChange}
                isDisabled={isButtonDisabled}
                getButtonText={getButtonText}
                onClick={sendTransaction}
                activeTab={activeTab}
            />

            {!isConnected && (
                <p className='text-center text-xs text-[#565656]'>
                    This action will open your wallet to sign the transaction.
                </p>
            )}

            {description}
        </>
    );
};
