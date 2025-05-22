import { useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useAccount } from 'wagmi';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ArrowDown } from 'lucide-react';

export const RedemptionPage = () => {
    const { isConnected } = useAccount();
    const [redeemAmount, setRedeemAmount] = useState('1234.84');
    const { open } = useWeb3Modal();
    const maxRedeem = 1234.84;
    const filToReceive = 383.96;
    const usdValue = 1289.27;
    const redemptionFee = 1.93;
    const feePercentage = '0.5%';

    const handleMaxRedeem = () => {
        setRedeemAmount(maxRedeem.toString());
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
                                <div className='text-3xl font-medium'>
                                    {redeemAmount}
                                </div>
                                <div className='flex items-center'>
                                    <SecuredFinanceLogo />
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='text-sm text-[#565656]'>
                                    ${redeemAmount}
                                </div>
                                <div className='text-sm'>
                                    {maxRedeem} USDFC{' '}
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
                                <div className='flex items-center border-[#e3e3e3] bg-white'>
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
                            className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white'
                            onClick={() => {
                                if (!isConnected) open();
                            }}
                        >
                            {isConnected ? 'Redeem USDFC' : 'Connect wallet'}
                        </button>
                        <p className='text-center text-xs text-[#565656]'>
                            This action will open your wallet to sign the
                            transaction.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
