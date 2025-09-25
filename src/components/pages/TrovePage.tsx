import { useSfStablecoinSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import { Adjusting } from 'src/components/Trove/Adjusting';
import { Opening } from 'src/components/Trove/Opening';
import { Trove } from 'src/components/organisms/Trove/Trove';

export const TrovePage = () => {
    const { isConnected } = useAccount();

    const trove = useSfStablecoinSelector(state => state.trove);
    const hasExistingTrove = !trove.isEmpty && isConnected;

    return (
        <div className='flex w-full flex-col'>
            <main className='flex flex-grow flex-col items-center px-4 py-8'>
                <div className='w-full'>
                    {hasExistingTrove ? (
                        <div className='w-full'>
                            <h1 className='text-2xl mb-2 text-center font-bold'>
                                Manage Trove
                            </h1>
                            <p className='mb-8 text-center text-sm text-neutral-450'>
                                Adjust your Trove&apos;s collateral, borrowed
                                amount, or both, or close it entirely.
                            </p>
                        </div>
                    ) : (
                        <div className='w-full'>
                            <h1 className='text-2xl mb-2 text-center font-bold'>
                                Create a Trove to Borrow USDFC
                            </h1>
                            <p className='mb-8 text-center text-sm text-neutral-450'>
                                A Trove is your personal vault where you can
                                deposit FIL as collateral to borrow USDFC with
                                0% interest, while maintaining exposure to FIL.
                            </p>
                        </div>
                    )}

                    {!hasExistingTrove && <Opening />}
                    {hasExistingTrove && (
                        <>
                            <h1 className='text-2xl mb-8 text-left font-semibold leading-none'>
                                Your Trove
                            </h1>
                            {trove && <Trove />}
                            <Adjusting />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
