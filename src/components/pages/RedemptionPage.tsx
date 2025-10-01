import {
    Decimal,
    Percent,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { useAccount } from 'wagmi';
import {
    selectForRedemptionChangeValidation,
    validateRedemptionChange,
} from '../Redemption/validation/validateRedemptionChange';
import { USDFCIconLarge } from '../SecuredFinanceLogo';
import { useMyTransactionState, useTransactionFunction } from '../Transaction';
import { TokenBox } from '../molecules';

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
    const [redeemAmountDecimal, setRedeemAmountDecimal] = useState(
        Decimal.from(0)
    );
    const [truncatedUSDFC, setTruncatedUSDFC] = useState(Decimal.from(0));
    const [changePending, setChangePending] = useState(false);
    const [hintsPending, setHintsPending] = useState(false);

    useEffect(() => {
        if (redeemAmountDecimal.isZero) {
            setTruncatedUSDFC(Decimal.from(0));
            return;
        }

        setHintsPending(true);

        const timeoutId = setTimeout(async () => {
            const hints = await sfStablecoin.findRedemptionHints(
                redeemAmountDecimal
            );
            setTruncatedUSDFC(hints[0]);
            setHintsPending(false);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            setHintsPending(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redeemAmountDecimal]);

    const redemptionRate = fees.redemptionRate();
    const feePct = new Percent(redemptionRate);
    const fee = truncatedUSDFC.mul(redemptionRate).div(price);

    const [isValid, validationMessage] = validateRedemptionChange(
        redeemAmountDecimal,
        truncatedUSDFC,
        hintsPending,
        fee,
        validationContext
    );

    const [sendTransaction] = useTransactionFunction(
        'redeem',
        sfStablecoin.send.redeemDebtToken.bind(
            sfStablecoin.send,
            redeemAmountDecimal,
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
                setRedeemAmountDecimal(Decimal.from(0));
            }
        }
    }, [myTransactionState.type]);

    const renderButtonContent = () => {
        if (!isConnected) {
            return 'Connect Wallet';
        }

        if (changePending) {
            return 'Processing...';
        }

        return 'Redeem USDFC';
    };

    const handleClick = () => {
        if (!isConnected) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            open();
        } else {
            sendTransaction();
        }
    };

    const filReceived = truncatedUSDFC.div(price).sub(fee);
    const filToReceive = filReceived.prettify(2);
    const redemptionFee = fee.prettify(2);
    const feePercentage = feePct.prettify();
    const usdValue = filReceived.mul(price).prettify(2);

    return (
        <div className='flex w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-8'>
                <div className='mb-[52px] flex w-full flex-col items-center gap-6 px-16'>
                    <h1 className='text-center font-primary text-6 font-semibold leading-[29px] text-neutral-900'>
                        Redeem USDFC
                    </h1>
                    <p className='w-full text-center font-primary text-4 font-normal leading-[144%] text-neutral-450'>
                        Exchange USDFC for {CURRENCY} at face value by repaying
                        the system&apos;s least collateralized Troves. This is
                        not the same as repaying your own debt—if your Trove is
                        undercollateralized, it may be partially redeemed.
                    </p>
                </div>
                <div className='w-full'>
                    <TokenBox
                        inputLabel='Redeem'
                        inputValue={redeemAmount}
                        autoFocusInput={true}
                        onInputChange={value => {
                            setRedeemAmount(value);
                            setRedeemAmountDecimal(Decimal.from(value || '0'));
                        }}
                        inputTokenIcon={
                            <>
                                <USDFCIconLarge />
                                <span className='text-2xl font-medium leading-none text-neutral-900'>
                                    USDFC
                                </span>
                            </>
                        }
                        inputSubLabel={`$${redeemAmountDecimal.prettify()}`}
                        outputLabel='You will receive'
                        outputValue={filToReceive}
                        outputSubLabel={`$${usdValue}`}
                        outputTokenIcon={
                            <>
                                <FILIcon className='h-8 w-8' />
                                <span className='text-2xl font-medium leading-none text-neutral-900'>
                                    {CURRENCY}
                                </span>
                            </>
                        }
                        maxValue={debtTokenBalance.prettify()}
                        onMaxClick={() => {
                            setRedeemAmount(debtTokenBalance.prettify(2));
                            setRedeemAmountDecimal(debtTokenBalance);
                        }}
                        isConnected={isConnected}
                    >
                        <div className='mb-6 flex w-full flex-col items-start gap-6 rounded-[20px] border border-neutral-150 bg-white p-6'>
                            <div className='flex w-full flex-col items-start gap-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-2'>
                                <div className='flex w-full flex-col items-start justify-center gap-1.5 tablet:max-w-[420px]'>
                                    <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                                        Redemption Fee
                                    </div>
                                    <div className='w-full font-primary text-sm font-normal leading-[140%] text-neutral-450'>
                                        A percentage of the {CURRENCY} received,
                                        starting at a minimum of 0.5%. It varies
                                        based on USDFC redemption volumes.
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                                            {redemptionFee}
                                        </span>
                                        <FILIcon className='h-6 w-6' />
                                        <span className='font-primary text-4 font-normal leading-[19px] text-neutral-900'>
                                            {CURRENCY}
                                        </span>
                                    </div>
                                    <span className='font-primary text-sm font-normal leading-[17px] text-neutral-450'>
                                        {feePercentage}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6'>{validationMessage}</div>

                        <div className='mt-6'>
                            <button
                                className='w-full rounded-xl bg-primary-500 py-3.5 font-medium text-white disabled:opacity-60'
                                disabled={
                                    isConnected && (!isValid || hintsPending)
                                }
                                onClick={handleClick}
                            >
                                {renderButtonContent()}
                            </button>
                        </div>

                        {isConnected && (
                            <p className='mt-2 text-center text-xs text-neutral-450'>
                                This action will open your wallet to sign the
                                transaction.
                            </p>
                        )}
                    </TokenBox>
                </div>
            </main>
        </div>
    );
};
