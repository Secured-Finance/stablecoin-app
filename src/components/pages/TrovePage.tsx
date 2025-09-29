import { Info } from 'lucide-react';
import { CustomTooltip } from 'src/components/atoms/CustomTooltip';
import { Trove } from 'src/components/organisms/Trove/Trove';
import { Adjusting } from 'src/components/Trove/Adjusting';
import { Opening } from 'src/components/Trove/Opening';
import { openDocumentation } from 'src/constants';
import { useSfStablecoinSelector } from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { useAccount } from 'wagmi';

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
                            <div className='mb-2 flex items-center justify-center gap-2'>
                                <h1 className='text-center font-primary text-6 font-semibold'>
                                    Manage Trove
                                </h1>
                                <CustomTooltip
                                    title='Trove'
                                    description={`A personal vault where you deposit ${CURRENCY} as collateral to borrow USDFC. It must maintain a minimum collateral ratio of 110% to avoid liquidation.`}
                                    onButtonClick={() =>
                                        openDocumentation('troveSystem')
                                    }
                                    position='bottom'
                                >
                                    <Info className='h-5 w-5 cursor-pointer text-neutral-400 hover:text-blue-500' />
                                </CustomTooltip>
                            </div>
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
                                deposit {CURRENCY} as collateral to borrow USDFC
                                with 0% interest, while maintaining exposure to{' '}
                                {CURRENCY}.
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
