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
                    <h1 className='text-2xl mb-8 text-left font-semibold leading-none'>
                        Your Trove
                    </h1>

                    {!hasExistingTrove && <Opening />}
                    {hasExistingTrove && (
                        <>
                            {trove && <Trove />}
                            <Adjusting />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
