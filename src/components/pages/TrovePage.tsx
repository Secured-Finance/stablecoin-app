import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomTooltip } from 'src/components/atoms/CustomTooltip';
import { StatusModal } from 'src/components/atoms/StatusModal/StatusModal';
import { Trove } from 'src/components/organisms/Trove/Trove';
import { Adjusting } from 'src/components/Trove/Adjusting';
import { Opening } from 'src/components/Trove/Opening';
import { openDocumentation } from 'src/constants';
import { useSfStablecoinSelector } from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { useAccount } from 'wagmi';

const select = ({
    collateralSurplusBalance,
    trove,
}: SfStablecoinStoreState) => ({
    hasSurplusCollateral: !collateralSurplusBalance.isZero,
    collateralSurplusBalance,
    trove: trove,
});

export const TrovePage = () => {
    const { isConnected } = useAccount();

    const store = useSfStablecoinSelector(select);
    const hasExistingTrove = !store.trove.isEmpty && isConnected;

    const [showLiquidationModal, setShowLiquidationModal] = useState(false);
    const [hasSeenLiquidation, setHasSeenLiquidation] = useState(false);

    useEffect(() => {
        if (store.hasSurplusCollateral && !hasSeenLiquidation) {
            setShowLiquidationModal(true);
        }
    }, [store.hasSurplusCollateral, hasSeenLiquidation]);

    const handleCloseLiquidationModal = () => {
        setShowLiquidationModal(false);
        setHasSeenLiquidation(true);
    };

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
                            {store.trove && <Trove />}
                            <Adjusting />
                        </>
                    )}
                </div>
            </main>
            <StatusModal
                isOpen={showLiquidationModal}
                type='warning'
                title='Trove Liquidated'
                description={
                    store.hasSurplusCollateral
                        ? 'Your Trove was liquidated because the collateral ratio fell below the minimum threshold. Your debt has been cleared and you have surplus collateral to claim.'
                        : 'Your Trove was liquidated because the collateral ratio fell below the minimum threshold. Your debt has been cleared and collateral was used to cover it.'
                }
                details={
                    store.hasSurplusCollateral
                        ? [
                              {
                                  label: 'Surplus Collateral:',
                                  value: `${store.collateralSurplusBalance.prettify()} ${CURRENCY}`,
                                  valueClassName: 'font-medium text-green-700',
                              },
                          ]
                        : undefined
                }
                detailsClassName='border-green-200 bg-green-50'
                onClose={handleCloseLiquidationModal}
                customActions={
                    store.hasSurplusCollateral
                        ? [
                              {
                                  label: 'Claim Surplus',
                                  onClick: handleCloseLiquidationModal,
                                  variant: 'primary',
                              },
                          ]
                        : [
                              {
                                  label: 'Close',
                                  onClick: handleCloseLiquidationModal,
                                  variant: 'primary',
                              },
                          ]
                }
            />
        </div>
    );
};
