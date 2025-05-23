import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useAccount } from 'wagmi';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import { useSfStablecoinReducer, useSfStablecoinSelector } from 'src/hooks';
import {
    selectForStabilityDepositChangeValidation,
    validateStabilityDepositChange,
} from '../Stability/validation/validateStabilityDepositChange';
import { init, reduce } from '../Stability/StabilityDepositManager';
import { useMyTransactionState } from '../Transaction';
import { useStabilityView } from '../Stability/context/StabilityViewContext';
import { StabilityDepositAction } from '../Stability/StabilityDepositAction';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';

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
    const [validChange] = validateStabilityDepositChange(
        originalDeposit,
        editedDebtToken,
        validationContext
    );
    const depositAmount = editedDebtToken.toString();
    const setDepositAmount = (val: string) =>
        dispatch({ type: 'setDeposit', newValue: val });

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
        }
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
    const { open } = useWeb3Modal();
    const liquidationGains = 0.1;
    const filUsdValue = 0.34;

    const handlemaxedOut = () => {
        setDepositAmount(maxAmount.toString());
    };

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
                                        {depositAmount}
                                    </div>
                                    <div className='ml-20 flex '>
                                        <div className='flex rounded-full '>
                                            <SecuredFinanceLogo />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='text-sm text-[#565656]'>
                                        ${depositAmount}
                                    </div>
                                    <div className='text-sm'>
                                        {originalDeposit.currentDebtToken.prettify()}{' '}
                                        USDFC{' '}
                                        <button
                                            className='ml-1 cursor-pointer text-[#1a30ff]'
                                            onClick={handlemaxedOut}
                                        >
                                            Max
                                        </button>
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
                                Manage Deposit
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
                                            Deposit
                                        </div>
                                        <div className='flex items-center gap-1 font-medium'>
                                            <span>
                                                {debtTokenBalance.toString()}
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
                                                    ${filUsdValue}
                                                </span>
                                            </div>

                                            <button className='text-xs font-medium text-[#1a30ff] hover:underline'>
                                                Claim Gains
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-6 flex overflow-hidden rounded-lg border border-[#e3e3e3]'>
                                <button
                                    className={`flex-1 py-2 font-medium ${
                                        activeTab === 'deposit'
                                            ? 'bg-[#1a30ff] text-white'
                                            : 'bg-white text-[#565656]'
                                    }`}
                                    onClick={() => setActiveTab('deposit')}
                                >
                                    Deposit
                                </button>
                                <button
                                    className={`flex-1 py-2 font-medium ${
                                        activeTab === 'withdraw'
                                            ? 'bg-[#1a30ff] text-white'
                                            : 'bg-white text-[#565656]'
                                    }`}
                                    onClick={() => setActiveTab('withdraw')}
                                >
                                    Withdraw
                                </button>
                            </div>

                            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                                <div className='mb-2 text-sm font-medium'>
                                    {activeTab === 'deposit'
                                        ? 'Deposit'
                                        : 'Withdraw'}
                                </div>

                                <div className='mb-1 flex items-center justify-between'>
                                    <input
                                        className='text-3xl w-full bg-transparent font-medium focus:outline-none'
                                        value={depositAmount}
                                        onChange={e =>
                                            setDepositAmount(e.target.value)
                                        }
                                    />
                                    <div className='ml-2 flex items-center'>
                                        <div className='flex items-center justify-center'>
                                            <SecuredFinanceLogo />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between text-sm text-[#565656]'>
                                    <div>${depositAmount}</div>
                                    <div>
                                        {maxedOut} USDFC{' '}
                                        <button
                                            className='ml-1 cursor-pointer text-[#1a30ff]'
                                            onClick={handlemaxedOut}
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
                                    {parseFloat(depositAmount)} USDFC
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
                                <StabilityDepositAction
                                    transactionId='stability-deposit'
                                    change={validChange}
                                >
                                    <span className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3 text-white hover:bg-[#1a30ff]/90'>
                                        {activeTab === 'deposit'
                                            ? 'Deposit USDFC'
                                            : 'Withdraw USDFC'}
                                    </span>
                                </StabilityDepositAction>
                            ) : (
                                <button
                                    disabled
                                    className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3 text-white hover:bg-[#1a30ff]/90'
                                >
                                    Confirm
                                </button>
                            )}

                            <p className='text-center text-xs text-[#565656]'>
                                This action will open your wallet to sign the
                                transaction.
                            </p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
