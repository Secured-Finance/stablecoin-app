import {
    Decimal,
    Percent,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import {
    selectForRedemptionChangeValidation,
    validateRedemptionChange,
} from '../Redemption/validation/validateRedemptionChange';
import { USDFCIcon } from '../SecuredFinanceLogo';
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
    const [truncatedUSDFC, setTruncatedUSDFC] = useState(Decimal.from(0));
    const [changePending, setChangePending] = useState(false);
    const [hintsPending, setHintsPending] = useState(false);
    const decimalRedeem = Decimal.from(redeemAmount || '0');

    useEffect(() => {
        if (decimalRedeem.isZero) {
            setTruncatedUSDFC(Decimal.from(0));
            return;
        }

        setHintsPending(true);

        const timeoutId = setTimeout(async () => {
            const hints = await sfStablecoin.findRedemptionHints(decimalRedeem);
            setTruncatedUSDFC(hints[0]);
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
    const fee = truncatedUSDFC.mul(redemptionRate).div(price);

    const [isValid, validationMessage] = validateRedemptionChange(
        decimalRedeem,
        truncatedUSDFC,
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

    const renderButtonContent = () => {
        if (!isConnected) {
            return 'Connect wallet';
        }

        if (changePending) {
            return 'Processing...';
        }

        return 'Redeem USDFC';
    };

    const handleClick = () => {
        if (!isConnected) {
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
        <div className='flex min-h-screen w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-8'>
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
                    <TokenBox
                        inputLabel='Redeem'
                        inputValue={redeemAmount}
                        onInputChange={setRedeemAmount}
                        inputTokenIcon={<USDFCIcon />}
                        outputLabel='You will receive'
                        outputValue={filToReceive}
                        outputSubLabel={`$${usdValue}`}
                        outputTokenIcon={
                            <div className='flex items-center gap-2'>
                                <FILIcon />
                                <span className='text-base font-semibold text-[#001C33]'>
                                    FIL
                                </span>
                            </div>
                        }
                        maxValue={debtTokenBalance.prettify()}
                        onMaxClick={() =>
                            setRedeemAmount(debtTokenBalance.toString())
                        }
                        isConnected={isConnected}
                    >
                        <div className='mb-6 w-full rounded-xl border border-[#e3e3e3] bg-white p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='mb-1 font-primary text-4 font-medium text-[#001C33]'>
                                        Redemption Fee
                                    </div>
                                    <div className='max-w-[280px] text-xs text-[#565656]'>
                                        A percentage of the FIL received,
                                        currently {feePercentage}. It varies
                                        based on USDFC redemption volumes.
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-sm font-medium text-[#001C33]'>
                                        {redemptionFee}
                                    </span>
                                    <div className='flex items-center gap-1'>
                                        <div className='flex h-4 w-4 items-center justify-center rounded-full bg-[#f5f5ff]'>
                                            <FILIcon />
                                        </div>
                                        <span className='text-xs'>FIL</span>
                                        <span className='text-xs text-[#565656]'>
                                            {feePercentage}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white disabled:opacity-60'
                            disabled={isConnected && (!isValid || hintsPending)}
                            onClick={handleClick}
                        >
                            {renderButtonContent()}
                        </button>

                        {!isConnected && (
                            <p className='text-center text-xs text-[#565656]'>
                                This action will open your wallet to sign the
                                transaction.
                            </p>
                        )}

                        {validationMessage}
                    </TokenBox>
                </div>
            </main>
        </div>
    );
};
