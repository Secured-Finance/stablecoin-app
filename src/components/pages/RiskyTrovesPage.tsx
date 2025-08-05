import {
    Decimal,
    SfStablecoinStoreState,
    UserTrove,
} from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useCallback, useEffect, useState } from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import { CoreTable } from '../molecules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type TroveWithDebtInFront = UserTrove & { debtInFront: Decimal };

export const RiskyTrovesPage = () => {
    const { isConnected } = useAccount();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const select = ({
        numberOfTroves,
        price,
        total,
        debtTokenInStabilityPool,
    }: SfStablecoinStoreState) => ({
        numberOfTroves,
        price,
        recoveryMode: total.collateralRatioIsBelowCritical(price),
        totalCollateralRatio: total.collateralRatio(price),
        debtTokenInStabilityPool,
    });
    const { open } = useWeb3Modal();
    const { numberOfTroves, price } = useSfStablecoinSelector(select);
    const { sfStablecoin } = useSfStablecoin();
    const [troves, setTroves] = useState<TroveWithDebtInFront[]>([]);
    const [reload, setReload] = useState({});
    const forceReload = useCallback(() => setReload({}), []);

    const totalPages = Math.ceil(numberOfTroves / pageSize) || 1;
    const clampedPage = Math.min(currentPage - 1, totalPages - 1);

    useEffect(() => {
        if (currentPage - 1 !== clampedPage) {
            setCurrentPage(clampedPage + 1);
        }
    }, [currentPage, clampedPage]);

    useEffect(() => {
        let mounted = true;

        const fetchRiskyTroves = async () => {
            if (!sfStablecoin) return;

            let previousDebt = Decimal.ZERO;

            if (clampedPage > 0) {
                const previousPages = await sfStablecoin.getTroves({
                    first: clampedPage * pageSize,
                    sortedBy: 'ascendingCollateralRatio',
                    startingAt: 0,
                });

                previousDebt = previousPages.reduce(
                    (sum, trove) => sum.add(trove.debt),
                    Decimal.ZERO
                );
            }

            const currentPage = await sfStablecoin.getTroves({
                first: pageSize,
                sortedBy: 'ascendingCollateralRatio',
                startingAt: clampedPage * pageSize,
            });

            let debtInFront = previousDebt;

            const enriched: TroveWithDebtInFront[] = currentPage.map(trove => {
                const enrichedTrove = Object.assign(
                    Object.create(Object.getPrototypeOf(trove)),
                    trove,
                    {
                        debtInFront,
                    }
                ) as TroveWithDebtInFront;

                debtInFront = debtInFront.add(trove.debt);
                return enrichedTrove;
            });

            if (mounted) {
                setTroves(enriched);
            }
        };

        fetchRiskyTroves();

        return () => {
            mounted = false;
        };
    }, [sfStablecoin, clampedPage, pageSize, reload]);

    useEffect(() => {
        forceReload();
    }, [forceReload, numberOfTroves]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className='flex w-full flex-col'>
            <main className='container mx-auto flex-grow px-2 py-4'>
                <h1 className='text-2xl mb-4 font-bold'>Risky Troves</h1>
                <p className='mb-2 max-w-3xl text-[#565656]'>
                    Track and liquidate risky Troves to maintain protocol
                    stability and earn rewards. Troves with a collateral ratio
                    below 110% (or 150% in Recovery Mode) are at risk, meaning
                    their FIL collateral may not fully cover their debt.
                </p>

                <div className='overflow-hidden'>
                    <CoreTable
                        troves={troves}
                        price={price}
                        isConnected={isConnected}
                        sfStablecoin={sfStablecoin}
                        open={open}
                    />
                </div>
                <div className='mt-6 flex items-center justify-between'>
                    <div className='flex items-center'>
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`flex items-center ${
                                currentPage === 1
                                    ? 'text-gray-300'
                                    : 'text-[#1a30ff]'
                            }`}
                        >
                            <ChevronLeft size={16} />
                            <span className='ml-1'>Previous</span>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`ml-4 flex items-center ${
                                currentPage === totalPages
                                    ? 'text-gray-300'
                                    : 'text-[#1a30ff]'
                            }`}
                        >
                            <span className='mr-1'>Next</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className='text-sm text-[#565656]'>
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </main>
        </div>
    );
};
