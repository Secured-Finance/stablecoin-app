import {
    Decimal,
    SfStablecoinStoreState,
    UserTrove,
} from '@secured-finance/stablecoin-lib-base';
import { useCallback, useEffect, useState } from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { CoreTable } from 'src/components/molecules';

type TroveWithDebtInFront = UserTrove & { debtInFront: Decimal };

export const RiskyTrovesPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

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
    const {
        numberOfTroves,
        price,
        recoveryMode,
        totalCollateralRatio,
        debtTokenInStabilityPool,
    } = useSfStablecoinSelector(select);
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
            <main className='flex flex-grow flex-col items-center px-0 py-8 tablet:px-4'>
                <div className='w-full px-4 tablet:px-0'>
                    <h1 className='text-lg tablet:text-2xl mb-2 text-left font-semibold leading-none'>
                        Risky Troves
                    </h1>
                    <p className='mb-4 max-w-3xl text-sm text-[#565656] tablet:text-base'>
                        Track and liquidate risky Troves to maintain protocol
                        stability and earn rewards. Troves with a collateral
                        ratio below 110% (or 150% in Recovery Mode) are at risk,
                        meaning their FIL collateral may not fully cover their
                        debt.
                    </p>
                </div>
                <div className='w-full tablet:px-0'>
                    <CoreTable
                        troves={troves}
                        price={price}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        loading={loading}
                        forceReload={forceReload}
                        recoveryMode={recoveryMode}
                        totalCollateralRatio={totalCollateralRatio}
                        debtTokenInStabilityPool={debtTokenInStabilityPool}
                    />
                </div>
            </main>
        </div>
    );
};
