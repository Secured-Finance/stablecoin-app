import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { Info } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomTooltip } from 'src/components/atoms/CustomTooltip';
import { StatusModal } from 'src/components/atoms/StatusModal/StatusModal';
import { Trove } from 'src/components/organisms/Trove/Trove';
import { Adjusting } from 'src/components/Trove/Adjusting';
import { Opening } from 'src/components/Trove/Opening';
import { openDocumentation } from 'src/constants';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { useAccount } from 'wagmi';
import { useTroveView } from 'src/components/Trove/context/TroveViewContext';
import {
    useMyTransactionState,
    useTransactionFunction,
} from 'src/components/Transaction';

const select = ({
    trove,
    collateralSurplusBalance,
}: SfStablecoinStoreState) => ({
    trove,
    troveStatus: trove.status,
    hasSurplusCollateral: !collateralSurplusBalance.isZero,
    collateralSurplusBalance,
});

const STORAGE_KEYS = {
    LIQUIDATION: 'sf.trove.liquidation.acknowledged',
    REDEMPTION: 'sf.trove.redemption.acknowledged',
} as const;

const CLAIM_TRANSACTION_ID = 'claim-coll-surplus';

type ModalType = 'liquidation' | 'redemption';

export const TrovePage = () => {
    const { isConnected, address } = useAccount();
    const store = useSfStablecoinSelector(select);
    const { view, dispatchEvent } = useTroveView();
    const {
        sfStablecoin: { send: sfStablecoin },
    } = useSfStablecoin();

    const hasExistingTrove = !store.trove.isEmpty && isConnected;
    const claimTransactionState = useMyTransactionState(CLAIM_TRANSACTION_ID);

    const [sendClaimTransaction] = useTransactionFunction(
        CLAIM_TRANSACTION_ID,
        sfStablecoin.claimCollateralSurplus.bind(sfStablecoin)
    );

    const [showLiquidationModal, setShowLiquidationModal] = useState(false);
    const [showRedemptionModal, setShowRedemptionModal] = useState(false);

    const storageKeys = useMemo(
        () =>
            address
                ? {
                      liquidation: `${STORAGE_KEYS.LIQUIDATION}:${address}`,
                      redemption: `${STORAGE_KEYS.REDEMPTION}:${address}`,
                  }
                : null,
        [address]
    );

    // Unified modal management for LIQUIDATED and REDEEMED views
    useEffect(() => {
        if (!storageKeys) return;

        if (view === 'LIQUIDATED') {
            const hasSeenModal = localStorage.getItem(storageKeys.liquidation);
            if (!hasSeenModal) {
                setShowLiquidationModal(true);
            }
        } else if (view === 'REDEEMED') {
            const hasSeenModal = localStorage.getItem(storageKeys.redemption);
            if (!hasSeenModal) {
                setShowRedemptionModal(true);
            }
        } else {
            // Clear storage when view changes away from LIQUIDATED/REDEEMED
            localStorage.removeItem(storageKeys.liquidation);
            localStorage.removeItem(storageKeys.redemption);
        }
    }, [view, storageKeys]);

    const handleCloseModal = useCallback(
        (modalType: ModalType) => {
            if (!storageKeys) return;

            const setModal =
                modalType === 'liquidation'
                    ? setShowLiquidationModal
                    : setShowRedemptionModal;
            const storageKey =
                modalType === 'liquidation'
                    ? storageKeys.liquidation
                    : storageKeys.redemption;

            setModal(false);

            // Only persist dismissal if no surplus exists
            // If surplus exists, modal should reappear until claimed
            if (!store.hasSurplusCollateral) {
                localStorage.setItem(storageKey, 'true');
            }
        },
        [storageKeys, store.hasSurplusCollateral]
    );

    const handleClaimClick = useCallback(async () => {
        // Close status modal before initiating transaction
        // to avoid modal overlay conflicts
        setShowLiquidationModal(false);
        setShowRedemptionModal(false);
        await sendClaimTransaction();
    }, [sendClaimTransaction]);

    // Handle successful claim transaction
    useEffect(() => {
        if (claimTransactionState.type === 'confirmedOneShot') {
            dispatchEvent('TROVE_SURPLUS_COLLATERAL_CLAIMED');
            setShowLiquidationModal(false);
            setShowRedemptionModal(false);
        }
    }, [claimTransactionState.type, dispatchEvent]);

    const getModalActions = useCallback(
        (modalType: ModalType) => {
            if (!store.hasSurplusCollateral) {
                return [
                    {
                        label: 'Close',
                        onClick: () => handleCloseModal(modalType),
                        variant: 'primary' as const,
                    },
                ];
            }

            return [
                {
                    label: `Claim ${store.collateralSurplusBalance.prettify()} ${CURRENCY}`,
                    onClick: handleClaimClick,
                    variant: 'primary' as const,
                    loading:
                        claimTransactionState.type === 'waitingForApproval',
                },
                {
                    label: 'Close',
                    onClick: () => handleCloseModal(modalType),
                    variant: 'secondary' as const,
                },
            ];
        },
        [
            store.hasSurplusCollateral,
            store.collateralSurplusBalance,
            claimTransactionState.type,
            handleClaimClick,
            handleCloseModal,
        ]
    );

    const surplusDetails = useMemo(
        () =>
            store.hasSurplusCollateral
                ? [
                      {
                          label: 'Surplus Collateral:',
                          value: `${store.collateralSurplusBalance.prettify()} ${CURRENCY}`,
                          valueClassName: 'font-medium text-green-700',
                      },
                  ]
                : undefined,
        [store.hasSurplusCollateral, store.collateralSurplusBalance]
    );

    const shouldShowOpening =
        view === 'LIQUIDATED' || view === 'REDEEMED' || view === 'NONE';

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

                    {shouldShowOpening && <Opening />}
                    {hasExistingTrove && !shouldShowOpening && (
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
                            <Trove />
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
                details={surplusDetails}
                detailsClassName='border-green-200 bg-green-50'
                onClose={() => handleCloseModal('liquidation')}
                customActions={getModalActions('liquidation')}
            />

            <StatusModal
                isOpen={showRedemptionModal}
                type='info'
                title='Trove Redeemed'
                description={
                    store.hasSurplusCollateral
                        ? 'Your Trove was redeemed by another user. Your debt has been paid off and you have surplus collateral to claim.'
                        : 'Your Trove was redeemed by another user. Your debt has been paid off using your collateral.'
                }
                details={surplusDetails}
                detailsClassName='border-green-200 bg-green-50'
                onClose={() => handleCloseModal('redemption')}
                customActions={getModalActions('redemption')}
            />
        </div>
    );
};
