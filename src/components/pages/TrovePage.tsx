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
        <div className='min-h-[100vh] w-full'>
            <main className='container mx-auto px-4 py-10'>
                <h1 className='text-3xl mb-8 font-bold'>Your Trove</h1>

                {!hasExistingTrove && <Opening />}
                {hasExistingTrove && (
                    <>
                        {trove && <Trove />}
                        <Adjusting />
                    </>
                )}
            </main>
        </div>
    );
};
