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
                        <div className='mb-[52px] flex w-full flex-col items-center'>
                            <div className='mb-6 flex w-full max-w-[720px] items-center justify-center gap-2 px-4 tablet:px-16'>
                                <h1 className='text-center font-primary text-5 font-semibold leading-[100%] text-neutral-900'>
                                    Manage Trove
                                </h1>
                            </div>
                            <p className='w-full max-w-[720px] px-4 text-center font-primary text-4 font-normal leading-[144%] text-neutral-450 tablet:px-16'>
                                Adjust your Trove&apos;s collateral, borrowed
                                amount, or both, or close it entirely.
                            </p>
                        </div>
                    ) : (
                        <div className='mb-[52px] flex w-full flex-col items-center gap-6 px-4 tablet:px-16'>
                            <h1 className='text-center font-primary text-6 font-semibold leading-[29px] text-neutral-900'>
                                Create a Trove to Borrow USDFC
                            </h1>
                            <p className='w-full max-w-[720px] text-center font-primary text-4 font-normal leading-[144%] text-neutral-450'>
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
                            <div className='mb-6 flex items-center gap-2'>
                                <h2 className='font-primary text-5 font-semibold leading-6 text-neutral-900'>
                                    Your Trove
                                </h2>
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
                            {trove && <Trove />}
                            <Adjusting />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
