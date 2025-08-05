import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useAccount } from 'wagmi';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import {
    useSfStablecoin,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import {
    selectForStabilityDepositChangeValidation,
    validateStabilityDepositChange,
} from '../Stability/validation/validateStabilityDepositChange';
import { init, reduce } from '../Stability/StabilityDepositManager';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';
import { useStabilityView } from '../Stability/context/StabilityViewContext';
import {
    SfStablecoinStoreState,
    Decimal,
} from '@secured-finance/stablecoin-lib-base';
import { COIN } from 'src/strings';

export const StabilityPoolPage = () => {
    const { isConnected } = useAccount();

    const [showManageView, setShowManageView] = useState(false);
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

            const withdrawAmount = currentDeposit.sub(newTotal);
            return withdrawAmount.prettify();
        }

        return editedDebtToken.prettify();
    };

    const displayAmount = getDisplayAmount();
    const setDepositAmount = (val: string) => {
        dispatch({ type: 'setDeposit', newValue: val });
    };

    // Handle input change based on active tab
    const handleInputChange = (val: string) => {
        if (activeTab === 'withdraw') {
            // For withdrawal, calculate new total by subtracting withdrawal amount from current
            const currentDeposit = originalDeposit.currentDebtToken;
            const withdrawAmount =
                val === '' ? Decimal.ZERO : Decimal.from(val);
            const newTotal = currentDeposit.sub(withdrawAmount);
            setDepositAmount(newTotal.toString());
        } else {
            // For deposit, set the total amount directly
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
            // Reset to initial state after confirmation
            dispatch({ type: 'finishChange' });
        }
        getButtonText();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myTransactionState.type, dispatch, dispatchEvent]);

    const select = ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    }: SfStablecoinStoreState) => ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    });
    const { debtTokenBalance, debtTokenInStabilityPool } =
        useSfStablecoinSelector(select);
    useEffect(() => {
        if (debtTokenInStabilityPool && isConnected) {
            setShowManageView(true);
        }
    }, [debtTokenInStabilityPool, isConnected]);

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
    const { open } = useWeb3Modal();
    const liquidationGains = originalDeposit.collateralGain.prettify(2);

    const handlemaxedOut = () => {
        if (activeTab === 'withdraw') {
            setDepositAmount('0');
        } else {
            setDepositAmount(maxAmount.toString());
        }
    };

    const isDepositOperation = validChange?.depositDebtToken !== undefined;

    const getButtonText = () => {
        if (myTransactionState.type === 'waitingForApproval') {
            return 'Waiting for Approval...';
        }
        if (myTransactionState.type === 'waitingForConfirmation') {
            return 'Processing...';
        }

        if (validChange) {
            return isDepositOperation ? 'Deposit USDFC' : 'Withdraw USDFC';
        }
        return activeTab === 'deposit' ? 'Deposit USDFC' : 'Withdraw USDFC';
    };

    const isButtonDisabled = () => {
        return (
            !validChange ||
            myTransactionState.type === 'waitingForApproval' ||
            myTransactionState.type === 'waitingForConfirmation'
        );
    };

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

    return (
        <div className='flex w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-16'>
                <div className='mx-auto w-full max-w-3xl'>
                    {!showManageView ? (
                        <>
                            <h1 className='text-2xl mb-2 text-center font-bold'>
                                Deposit USDFC into the Stability Pool
                            </h1>
                            <p className='mb-8 text-center text-sm text-[#565656]'>
                                Deposit USDFC to earn FIL rewards. The pool
                                helps maintain system stability by covering
                                liquidated debt, ensuring a balanced and secure
                                ecosystem.
                            </p>

                            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                                <div className='mb-2 text-sm font-medium'>
                                    Deposit
                                </div>
                                <div className='mb-1 flex items-center justify-between'>
                                    <div className='text-3xl font-medium'>
                                        {displayAmount}
                                    </div>
                                    <div className='ml-20 flex '>
                                        <div className='flex rounded-full '>
                                            <SecuredFinanceLogo />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='text-sm text-[#565656]'>
                                        ${displayAmount}
                                    </div>
                                    <div className='flex gap-1 text-sm'>
                                        <span>
                                            {originalDeposit.currentDebtToken.prettify()}
                                        </span>
                                        <span>{COIN}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <div className='mb-1 text-sm font-medium'>
                                            Pool Share
                                        </div>
                                        <div className='max-w-[280px] text-xs text-[#565656]'>
                                            Your percentage of the Stability
                                            Pool, determining your share of
                                            liquidated collateral and rewards.
                                        </div>
                                    </div>
                                    <div className='text-base font-medium'>
                                        {originalPoolShare.prettify()}%
                                    </div>
                                </div>
                            </div>

                            <button
                                className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white hover:bg-[#1a30ff]/90'
                                onClick={() => {
                                    if (isConnected) {
                                        setShowManageView(true);
                                    } else {
                                        open();
                                    }
                                }}
                            >
                                {isConnected
                                    ? 'Deposit USDFC'
                                    : 'Connect Wallet'}
                            </button>

                            <p className='text-center text-xs text-[#565656]'>
                                This action will open your wallet to sign the
                                transaction.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className='text-2xl mb-2 text-center font-bold'>
                                Manage{' '}
                                {activeTab === 'deposit'
                                    ? 'Deposit'
                                    : 'Withdrawal'}
                            </h1>
                            <p className='mb-8 text-center text-sm text-[#565656]'>
                                Adjust your Stability Pool deposit by adding
                                more USDFC or withdrawing a portion or the full
                                amount.
                            </p>

                            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div>
                                        <div className='mb-1 text-sm text-[#565656]'>
                                            Current Deposit
                                        </div>
                                        <div className='flex items-center gap-1 font-medium'>
                                            <span>
                                                {originalDeposit.currentDebtToken.prettify()}
                                            </span>
                                            <SecuredFinanceLogo />
                                        </div>
                                    </div>

                                    <div>
                                        <div className='mb-1 text-sm text-[#565656]'>
                                            Pool Share
                                        </div>
                                        <div className='font-medium'>
                                            {originalPoolShare.prettify()}%
                                        </div>
                                    </div>

                                    <div>
                                        <div className='mb-1 text-sm text-[#565656]'>
                                            Liquidation Gains
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-1 font-medium'>
                                                <span>{liquidationGains}</span>
                                                <FILIcon />
                                                <span>FIL</span>
                                                <span className='ml-2 text-xs text-[#565656]'>
                                                    {/* ${filUsdValue} */}
                                                </span>
                                            </div>

                                            <button className='text-xs font-medium text-[#1a30ff] hover:underline'>
                                                Claim Gains
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-6 flex gap-1 overflow-hidden rounded-xl border border-[#e3e3e3] bg-[#F5f5f5]'>
                                <button
                                    className={`flex-1 rounded-xl py-2 font-medium text-[#565656] ${
                                        activeTab === 'deposit'
                                            ? 'border border-[#E3E3E3] bg-white'
                                            : 'bg-[#F5f5f5]'
                                    }`}
                                    onClick={() => setActiveTab('deposit')}
                                    disabled={
                                        myTransactionState.type ===
                                            'waitingForApproval' ||
                                        myTransactionState.type ===
                                            'waitingForConfirmation'
                                    }
                                >
                                    Deposit
                                </button>
                                <button
                                    className={`flex-1 rounded-xl py-2 font-medium text-[#565656] ${
                                        activeTab === 'withdraw'
                                            ? 'border border-[#E3E3E3] bg-white'
                                            : 'bg-[#F5f5f5]'
                                    }`}
                                    onClick={() => setActiveTab('withdraw')}
                                    disabled={
                                        myTransactionState.type ===
                                            'waitingForApproval' ||
                                        myTransactionState.type ===
                                            'waitingForConfirmation'
                                    }
                                >
                                    Withdraw
                                </button>
                            </div>

                            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                                <div className='mb-2 text-sm font-medium'>
                                    {activeTab === 'deposit'
                                        ? 'Deposit Amount'
                                        : 'Withdraw Amount'}
                                </div>

                                <div className='mb-1 flex items-center justify-between'>
                                    <input
                                        className='text-3xl w-full bg-transparent font-medium focus:outline-none'
                                        value={displayAmount}
                                        onChange={e =>
                                            handleInputChange(e.target.value)
                                        }
                                        type='number'
                                        disabled={
                                            myTransactionState.type ===
                                                'waitingForApproval' ||
                                            myTransactionState.type ===
                                                'waitingForConfirmation'
                                        }
                                    />
                                    <div className='ml-2 flex items-center'>
                                        <div className='flex items-center justify-center'>
                                            <SecuredFinanceLogo />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between text-sm text-[#565656]'>
                                    <div>${displayAmount}</div>
                                    <div>
                                        {maxAmount.prettify()} USDFC{' '}
                                        <button
                                            className='ml-1 cursor-pointer text-[#1a30ff] disabled:cursor-not-allowed disabled:opacity-50'
                                            onClick={handlemaxedOut}
                                            disabled={
                                                myTransactionState.type ===
                                                    'waitingForApproval' ||
                                                myTransactionState.type ===
                                                    'waitingForConfirmation'
                                            }
                                        >
                                            Max
                                        </button>
                                    </div>
                                </div>
                            </div>

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

                            {validChange ? (
                                <button
                                    className={`mb-3 w-full rounded-xl py-3 font-medium text-white ${
                                        isButtonDisabled()
                                            ? 'cursor-not-allowed bg-gray-400'
                                            : 'bg-[#1a30ff] hover:bg-[#1a30ff]/90'
                                    }`}
                                    disabled={isButtonDisabled()}
                                    onClick={sendTransaction}
                                >
                                    {getButtonText()}
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className='mb-3 w-full cursor-not-allowed rounded-xl bg-gray-400 py-3 text-white'
                                >
                                    {activeTab === 'deposit'
                                        ? ' Deposit'
                                        : ' Withdraw'}{' '}
                                    {COIN}
                                </button>
                            )}

                            {!isConnected && (
                                <p className='text-center text-xs text-[#565656]'>
                                    This action will open your wallet to sign
                                    the transaction.
                                </p>
                            )}
                            {description}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
