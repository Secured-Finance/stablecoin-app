/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function Stake() {
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();
    const [stakeAmount, setStakeAmount] = useState('100.00');

    // Mock max value - in a real app, this would come from your backend or blockchain
    const maxStake = '2000';

    const handleMaxStake = () => {
        setStakeAmount(maxStake.toString());
    };

    return (
        <div className='flex min-w-full flex-col'>
            <main className='flex flex-grow flex-col items-center px-4 py-16'>
                <div className='mx-auto w-full max-w-3xl'>
                    <h1 className='text-2xl mb-2 text-center font-bold'>
                        Stake SFC
                    </h1>
                    <p className='mb-8 text-center text-sm text-[#565656]'>
                        Stake SFC, the governance token, to earn a share of
                        borrowing and redemption fees.
                    </p>

                    <div className='mx-auto max-w-md'>
                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                            <div className='mb-2 text-sm font-medium'>
                                Stake
                            </div>
                            <div className='mb-1 flex items-center justify-between'>
                                <input
                                    className='text-3xl mr-2 w-full bg-transparent font-medium focus:outline-none'
                                    value={stakeAmount}
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (value <= maxStake) {
                                            setStakeAmount(value);
                                        }
                                    }}
                                    placeholder='0.00'
                                    type='number'
                                />
                                <div className='inline-flex shrink-0 items-center rounded-full border border-gray-200 px-2 py-1'>
                                    <div className='mr-2 h-6 w-6 rounded-full bg-gradient-to-b from-[#676CFF] to-[#2B2C5C]' />
                                    <span className='text-sm font-medium text-[#0A1A2F]'>
                                        SFC
                                    </span>
                                </div>
                            </div>
                            {isConnected && (
                                <div className='flex items-center justify-between'>
                                    <div className='text-sm text-[#565656]'>
                                        ${Number(stakeAmount || 0)}
                                    </div>
                                    <div className='text-sm'>
                                        {maxStake} SFC
                                        <button onClick={handleMaxStake}>
                                            <span className='ml-1 cursor-pointer text-[#1a30ff]'>
                                                Max
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white'
                            onClick={!isConnected ? () => open() : () => {}}
                        >
                            {isConnected ? 'Stake SFC' : 'Connect Wallet'}
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
}
