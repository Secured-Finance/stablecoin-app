import {
    Decimal,
    SfStablecoinStoreState,
    UserTrove,
} from '@secured-finance/stablecoin-lib-base';
import { useCallback, useEffect, useState } from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import { Spinner } from '../Spinner';
import { CoreTable } from 'src/components/molecules';

type TroveWithDebtInFront = UserTrove & { debtInFront: Decimal };

export const RiskyTrovesPage = () => {
    const { isConnected } = useAccount();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

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
    const { numberOfTroves, price } = useSfStablecoinSelector(select);
    const { sfStablecoin } = useSfStablecoin();
    const [troves, setTroves] = useState<TroveWithDebtInFront[]>([]);
    const [reload, setReload] = useState({});
    const [loading, setLoading] = useState(false);

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
            setLoading(true);

            try {
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

                const enriched: TroveWithDebtInFront[] = currentPage.map(
                    trove => {
                        const enrichedTrove = Object.assign(
                            Object.create(Object.getPrototypeOf(trove)),
                            trove,
                            {
                                debtInFront,
                            }
                        ) as TroveWithDebtInFront;

                        debtInFront = debtInFront.add(trove.debt);
                        return enrichedTrove;
                    }
                );

                if (mounted) {
                    setTroves(enriched);
                }
            } finally {
                setLoading(false);
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
            <main className='container mx-auto flex-grow px-2 py-5'>
                <h1 className='mb-4 font-primary text-6 font-semibold'>
                    Risky Troves
                </h1>
                <p className='mb-2 max-w-3xl text-[#565656]'>
                    Track and liquidate risky Troves to maintain protocol
                    stability and earn rewards. Troves with a collateral ratio
                    below 110% (or 150% in Recovery Mode) are at risk, meaning
                    their FIL collateral may not fully cover their debt.
                </p>

                <div className='relative flex min-h-[300px] items-center justify-center overflow-hidden'>
                    {loading ? (
                        <div className='flex h-[300px] items-center justify-center'>
                            <Spinner />
                        </div>
                    ) : (
                        <CoreTable
                            troves={troves}
                            price={price}
                            isConnected={isConnected}
                            sfStablecoin={sfStablecoin}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};
