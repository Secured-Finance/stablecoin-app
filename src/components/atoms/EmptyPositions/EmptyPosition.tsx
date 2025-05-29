import { Layers2, Vault } from 'lucide-react';

export function EmptyPositions() {
    return (
        <div>
            <h2 className='mb-4 font-primary text-5/none font-semibold'>
                My Positions
            </h2>

            <div className='grid grid-cols-1 justify-items-center gap-6 laptop:grid-cols-2'>
                <div className='max-w-[450px] rounded-xl border border-neutral-9 bg-white p-6'>
                    <div className='mb-6 flex '>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-50'>
                            <Vault className='h-6 w-6 text-[#A6A6A6]' />
                        </div>
                    </div>

                    <h3 className='text-lg mb-2 font-bold'>No Trove Yet</h3>
                    <p className='mb-6 text-sm text-secondary-400'>
                        A Trove is your personal vault where you can deposit FIL
                        as collateral to borrow USDFC with 0% interest, while
                        maintaining exposure to FIL.
                    </p>

                    <button className='mt-4 w-full rounded-md bg-primary-500 py-2 text-white'>
                        Create Trove
                    </button>
                </div>

                <div className='max-w-[450px] rounded-xl border border-neutral-9 bg-white p-6'>
                    <div className='mb-6'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-50'>
                            <Layers2 className='h-6 w-6 text-[#A6A6A6]' />
                        </div>
                    </div>

                    <h3 className='text-lg mb-2 font-bold'>
                        No Stability Pool Deposit Yet
                    </h3>
                    <p className='mb-6 text-sm text-secondary-400'>
                        Deposit USDFC to earn FIL rewards. The pool helps
                        maintain system stability by covering liquidated debt,
                        ensuring a balanced and secure ecosystem.
                    </p>

                    <button className='mt-4 w-full rounded-md bg-primary-500 py-2 text-white'>
                        Deposit
                    </button>
                </div>
            </div>
        </div>
    );
}
