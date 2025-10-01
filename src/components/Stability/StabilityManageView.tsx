import {
    Decimal,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomTooltip } from 'src/components/atoms';
import { openDocumentation } from 'src/constants';
import {
    useSfStablecoin,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { CURRENCY } from 'src/strings';
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
    const { open } = useWeb3Modal();
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

        // For deposit tab, always start with empty regardless of existing deposit
        const depositAmount = editedDebtToken.gt(
            originalDeposit.currentDebtToken
        )
            ? editedDebtToken.sub(originalDeposit.currentDebtToken)
            : Decimal.ZERO;
        return depositAmount.isZero ? '' : depositAmount.prettify(2);
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

            // Cap the withdrawal amount to the maximum available deposit
            const cappedWithdrawAmount = withdrawAmount.gt(currentDeposit)
                ? currentDeposit
                : withdrawAmount;

            // Update the input to show the capped amount
            const cappedInputValue = cappedWithdrawAmount.isZero
                ? ''
                : cappedWithdrawAmount.prettify(2);

            setWithdrawAmountInput(cappedInputValue);

            // Calculate the new total deposit after withdrawal
            const newTotal = currentDeposit.sub(cappedWithdrawAmount);
            setDepositAmount(newTotal.toString());
        } else {
            // For deposit tab, add the new deposit amount to existing deposit
            const newDepositAmount =
                val === '' ? Decimal.ZERO : Decimal.from(val);
            const totalDeposit =
                originalDeposit.currentDebtToken.add(newDepositAmount);
            setDepositAmount(totalDeposit.toString());
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

    // Clear input fields when the deposit amount changes
    const currentDepositAmount = originalDeposit.currentDebtToken.toString();
    useEffect(() => {
        setWithdrawAmountInput('');
        dispatch({ type: 'revert' });
    }, [currentDepositAmount, dispatch]);

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
            <div className='mb-[52px] flex w-full flex-col items-center'>
                <h1 className='mb-6 w-full max-w-[720px] px-4 text-center font-primary text-5 font-semibold leading-[100%] text-neutral-900 tablet:px-16'>
                    {originalDeposit.isEmpty
                        ? 'Deposit USDFC into the Stability Pool'
                        : 'Manage Deposit'}
                </h1>
                <p className='w-full max-w-[720px] px-4 text-center font-primary text-4 font-normal leading-[144%] text-neutral-450 tablet:px-16'>
                    {originalDeposit.isEmpty
                        ? `Deposit USDFC to earn ${CURRENCY} rewards. The pool helps maintain system stability by covering liquidated debt, ensuring a balanced and secure ecosystem.`
                        : 'Adjust your Stability Pool deposit by adding more USDFC or withdrawing a portion or the full amount.'}
                </p>
            </div>

            {!originalDeposit.isEmpty && (
                <StabilityStats
                    originalDeposit={originalDeposit}
                    originalPoolShare={originalPoolShare}
                    liquidationGains={liquidationGains}
                />
            )}

            <TabSwitcher
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                disabled={isDisabled}
                hasDeposit={!originalDeposit.isEmpty}
            />

            <StabilityAmountInput
                label={
                    originalDeposit.isEmpty || activeTab === 'deposit'
                        ? 'Deposit'
                        : 'Withdraw'
                }
                displayAmount={displayAmount}
                handleInputChange={handleInputChange}
                maxAmount={
                    activeTab === 'withdraw'
                        ? originalDeposit.currentDebtToken
                        : debtTokenBalance
                }
                disabled={isDisabled}
                focusKey={activeTab}
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
                            <div className='mb-1 flex items-center gap-2'>
                                <div className='font-primary text-4 font-medium leading-[100%]'>
                                    Pool Share
                                </div>
                                <CustomTooltip
                                    title='Pool Share'
                                    description='Your percentage of the Stability Pool, determining your share of liquidated collateral and rewards.'
                                    onButtonClick={() =>
                                        openDocumentation('stabilityPool')
                                    }
                                    position='top'
                                >
                                    <Info className='h-5 w-5 cursor-pointer text-neutral-400 hover:text-blue-500' />
                                </CustomTooltip>
                            </div>
                            <div className='max-w-[420px] font-primary text-sm font-normal leading-[140%] text-neutral-450'>
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
                    <div className='mb-6 flex flex-col gap-4 rounded-xl border border-neutral-9 bg-white p-4 tablet:flex-row tablet:justify-between tablet:gap-0'>
                        <div>
                            <div className='mb-1 text-4 font-medium text-neutral-450'>
                                New Total Deposit
                            </div>
                            <div className='max-w-[280px] text-sm font-normal text-neutral-450'>
                                Your updated deposit amount in the Stability
                                Pool after this transaction.
                            </div>
                        </div>
                        <div className='flex items-center gap-1 text-base font-medium tablet:mt-2'>
                            <span>
                                {validChange?.depositDebtToken
                                    ? originalDeposit.currentDebtToken
                                          .add(validChange.depositDebtToken)
                                          .prettify()
                                    : validChange?.withdrawDebtToken
                                    ? originalDeposit.currentDebtToken
                                          .sub(validChange.withdrawDebtToken)
                                          .prettify()
                                    : editedDebtToken.prettify()}
                            </span>
                            <USDFCIcon />
                            <span>USDFC</span>
                        </div>
                    </div>

                    <div className='mb-6 flex flex-col gap-4 rounded-xl border border-neutral-9 bg-white p-4 tablet:flex-row tablet:justify-between tablet:gap-0'>
                        <div>
                            <div className='mb-1 flex items-center gap-2'>
                                <div className='mb-1 text-4 font-medium text-neutral-450'>
                                    New Pool Share
                                </div>
                                <CustomTooltip
                                    title='Pool Share'
                                    description='Your percentage of the Stability Pool, determining your share of liquidated collateral and rewards.'
                                    onButtonClick={() =>
                                        openDocumentation('stabilityPool')
                                    }
                                    position='top'
                                >
                                    <Info className='h-5 w-5 cursor-pointer text-neutral-400 hover:text-blue-500' />
                                </CustomTooltip>
                            </div>
                            <div className='max-w-[280px] font-primary text-sm text-neutral-450'>
                                Your percentage of the Stability Pool after this
                                transaction, determining your share of
                                liquidated collateral and rewards.
                            </div>
                        </div>
                        <div className='text-base font-medium tablet:mt-2'>
                            {newPoolShare.prettify()}%
                        </div>
                    </div>
                </>
            )}

            <div className='mt-6'>{description}</div>

            <div className='mt-6'>
                <ActionButton
                    validChange={validChange}
                    isDisabled={isButtonDisabled}
                    getButtonText={getButtonText}
                    onClick={sendTransaction}
                    activeTab={activeTab}
                    isConnected={isConnected}
                    onConnectWallet={open}
                />
            </div>

            {isConnected && (
                <p className='mt-2 text-center text-xs text-neutral-450'>
                    This action will open your wallet to sign the transaction.
                </p>
            )}
        </>
    );
};
