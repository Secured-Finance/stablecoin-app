import {
    Decimal,
    Percent,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import {
    selectForRedemptionChangeValidation,
    validateRedemptionChange,
} from '../Redemption/validation/validateRedemptionChange';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';

export const RedemptionPage = () => {
    const selector = (state: SfStablecoinStoreState) => {
        const { fees, debtTokenBalance, price } = state;
        return {
            fees,
            debtTokenBalance,
            price,
            validationContext: selectForRedemptionChangeValidation(state),
        };
    };

    const { open } = useWeb3Modal();
    const { isConnected } = useAccount();
    const { fees, debtTokenBalance, price, validationContext } =
        useSfStablecoinSelector(selector);

    const { sfStablecoin } = useSfStablecoin();
    const myTransactionState = useMyTransactionState('redeem');

    const [redeemAmount, setRedeemAmount] = useState('0.00');
    const [estimatedFIL, setEstimatedFIL] = useState(Decimal.from(0));
    const [changePending, setChangePending] = useState(false);
    const [hintsPending, setHintsPending] = useState(false);
    const decimalRedeem = Decimal.from(redeemAmount || '0');
    const maxAmount = debtTokenBalance;

    useEffect(() => {
        if (decimalRedeem.isZero) {
            setEstimatedFIL(Decimal.from(0));
            return;
        }

        setHintsPending(true);

        const timeoutId = setTimeout(async () => {
            const hints = await sfStablecoin.findRedemptionHints(decimalRedeem);
            setEstimatedFIL(hints[0]);
            setHintsPending(false);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            setHintsPending(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redeemAmount]);

    const redemptionRate = fees.redemptionRate();
    const feePct = new Percent(redemptionRate);
    const fee = estimatedFIL.mul(redemptionRate).div(price);

    const [isValid, validationMessage] = validateRedemptionChange(
        decimalRedeem,
        estimatedFIL,
        hintsPending,
        fee,
        validationContext
    );

    const [sendTransaction] = useTransactionFunction(
        'redeem',
        sfStablecoin.send.redeemDebtToken.bind(
            sfStablecoin.send,
            decimalRedeem,
            undefined
        )
    );

    useEffect(() => {
        if (
            myTransactionState.type === 'waitingForApproval' ||
            myTransactionState.type === 'waitingForConfirmation'
        ) {
            setChangePending(true);
        } else {
            setChangePending(false);
            if (myTransactionState.type === 'confirmed') {
                setRedeemAmount('0.00');
            }
        }
    }, [myTransactionState.type]);

    const filToReceive = estimatedFIL.div(price).sub(fee).prettify(2);
    const redemptionFee = fee.prettify(2);
    const feePercentage = feePct.toString(2);
    const usdValue = estimatedFIL.mul(price).prettify(2);

    const handleMaxRedeem = () => {
        setRedeemAmount(maxAmount.prettify(2));
    };

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-16'>
                <div className='mx-auto w-full max-w-3xl'>
                    <h1 className='mb-3 text-center font-primary text-5/none font-semibold'>
                        Redeem USDFC
                    </h1>
                    <p className='mb-8 text-center text-sm text-[#565656]'>
                        Exchange USDFC for FIL at face value by repaying the
                        system&apos;s least <br />
                        collateralized Troves. This is not the same as repaying
                        your own debt—if your Trove
                        <br /> is undercollateralized, it may be partially
                        redeemed.
                    </p>

                    <div className='mx-auto max-w-md'>
                        <div className='mb-2 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                            <div className='mb-2 text-sm font-medium'>
                                Redeem
                            </div>
                            <div className='mb-1 flex items-center justify-between'>
                                <input
                                    type='number'
                                    className='text-3xl w-full bg-transparent font-medium outline-none'
                                    value={redeemAmount}
                                    onChange={e =>
                                        setRedeemAmount(e.target.value)
                                    }
                                />

                                <div className='flex items-center'>
                                    <SecuredFinanceLogo />
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div className='text-sm text-[#565656]'>
                                    ${redeemAmount}
                                </div>
                                <div className='text-sm'>
                                    {maxAmount.prettify(2)} USDFC
                                    <button
                                        className='ml-1 cursor-pointer text-[#1a30ff]'
                                        onClick={handleMaxRedeem}
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='my-4 flex justify-center'>
                            <ArrowDown className='h-8 w-8' />
                        </div>
                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                            <div className='mb-2 text-sm font-medium'>
                                You will receive
                            </div>
                            <div className='mb-1 flex items-center justify-between'>
                                <div className='text-3xl font-medium'>
                                    {filToReceive}
                                </div>
                                <div className='flex items-center'>
                                    <div className='mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5ff]'>
                                        <FILIcon />
                                    </div>
                                    <span className='font-medium'>FIL</span>
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='text-sm text-[#565656]'>
                                    ${usdValue}
                                </div>
                            </div>
                        </div>
                        <div className='mb-6 rounded-lg border border-[#e3e3e3] bg-white p-4'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='mb-1 text-sm font-medium'>
                                        Redemption Fee
                                    </div>
                                    <div className='max-w-[280px] text-xs text-[#565656]'>
                                        A percentage of the FIL received,
                                        starting at a minimum of 0.5%. It varies
                                        based on USDFC redemption volumes.
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 border-[#e3e3e3] bg-white'>
                                    <span className='mr-1 font-medium'>
                                        {redemptionFee}
                                    </span>
                                    <div className='flex items-center'>
                                        <div className='mr-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f5f5ff]'>
                                            <FILIcon />
                                        </div>
                                        <span className='text-xs'>FIL</span>
                                    </div>
                                    <span className='ml-1 text-xs text-[#565656]'>
                                        {feePercentage}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white disabled:opacity-60'
                            disabled={!isConnected || !isValid || hintsPending}
                            onClick={() => {
                                if (!isConnected) open();
                                else sendTransaction();
                            }}
                        >
                            {isConnected
                                ? changePending
                                    ? 'Processing...'
                                    : 'Redeem USDFC'
                                : 'Connect wallet'}
                        </button>
                        {!isConnected && (
                            <p className='text-center text-xs text-[#565656]'>
                                This action will open your wallet to sign the
                                transaction.
                            </p>
                        )}
                        {validationMessage}
                    </div>
                </div>
            </main>
        </div>
    );
};
