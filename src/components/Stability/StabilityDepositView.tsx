import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
    useSfStablecoin,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import { COIN } from 'src/strings';
import { init, reduce } from 'src/components/Stability/StabilityDepositManager';
import {
    useMyTransactionState,
    useTransactionFunction,
} from 'src/components/Transaction';

export function StabilityDepositView() {
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();

    const [{ originalDeposit }, dispatch] = useSfStablecoinReducer(
        reduce,
        init
    );

    const selectBalances = ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    }: SfStablecoinStoreState) => ({
        debtTokenBalance,
        debtTokenInStabilityPool,
    });
    const { debtTokenInStabilityPool } =
        useSfStablecoinSelector(selectBalances);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        dispatch({ type: 'setDeposit', newValue: inputValue || '0' });
    }, [inputValue, dispatch]);

    const myTransactionState = useMyTransactionState('stability-deposit');

    const originalPoolShare = originalDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );

    const isDisabled =
        myTransactionState.type === 'waitingForApproval' ||
        myTransactionState.type === 'waitingForConfirmation' ||
        !isConnected;

    const getButtonText = () => {
        if (myTransactionState.type === 'waitingForApproval')
            return 'Waiting for Approval...';
        if (myTransactionState.type === 'waitingForConfirmation')
            return 'Processing...';
        return 'Deposit USDFC';
    };

    const { config, sfStablecoin } = useSfStablecoin();

    const frontendRegistered = useSfStablecoinSelector(
        state => state.frontend.status === 'registered'
    );
    const frontendTag = frontendRegistered ? config.frontendTag : undefined;

    const [sendTransaction] = useTransactionFunction(
        myTransactionState.type,
        sfStablecoin.send.depositDebtTokenInStabilityPool.bind(
            sfStablecoin.send,
            Decimal.from(inputValue || '0'),
            frontendTag
        )
    );

    return (
        <>
            <h1 className='text-2xl mb-2 text-center font-bold'>
                Deposit USDFC into the Stability Pool
            </h1>
            <p className='mb-8 text-center text-sm text-neutral-450'>
                Deposit USDFC to earn FIL rewards. The pool helps maintain
                system stability by covering liquidated debt, ensuring a
                balanced and secure ecosystem.
            </p>

            <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
                <div className='mb-2 font-primary text-4 font-medium'>
                    Deposit
                </div>
                <div className='mb-1 flex items-center justify-between'>
                    <input
                        className='w-full bg-transparent text-8 font-medium focus:outline-none'
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        type='number'
                        disabled={isDisabled}
                        placeholder='0.00'
                        min='0'
                    />
                    <div className='ml-2 flex items-center'>
                        <USDFCIcon />
                    </div>
                </div>
                {isConnected && (
                    <div className='flex gap-1 text-sm text-neutral-450'>
                        <span>
                            {originalDeposit.currentDebtToken.prettify()}
                        </span>
                        <span>{COIN}</span>
                    </div>
                )}
            </div>

            <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
                <div className='flex items-center justify-between'>
                    <div>
                        <div className='mb-1 text-sm font-medium'>
                            Pool Share
                        </div>
                        <div className='max-w-[280px] text-xs text-neutral-450'>
                            Your percentage of the Stability Pool, determining
                            your share of liquidated collateral and rewards.
                        </div>
                    </div>
                    <div className='text-base font-medium'>
                        {originalPoolShare.prettify()}%
                    </div>
                </div>
            </div>

            <button
                className={`mb-3 w-full rounded-xl py-3.5 font-medium text-white ${
                    isDisabled
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-primary-500 hover:bg-primary-700'
                }`}
                onClick={() => {
                    if (isConnected) {
                        sendTransaction();
                    } else {
                        open();
                    }
                }}
                disabled={isDisabled}
            >
                {isConnected ? getButtonText() : 'Connect Wallet'}
            </button>

            <p className='text-center text-xs text-neutral-450'>
                This action will open your wallet to sign the transaction.
            </p>
        </>
    );
}
