import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    MINIMUM_COLLATERAL_RATIO,
    Percent,
    SfStablecoinStoreState,
    UserTrove,
} from '@secured-finance/stablecoin-lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { CheckIcon, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { AddressUtils } from 'src/utils';
import { useAccount } from 'wagmi';

export const RiskyTrovesPage = () => {
    const { isConnected } = useAccount();
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
    const { open } = useWeb3Modal();
    const { numberOfTroves, price } = useSfStablecoinSelector(select);
    const { sfStablecoin } = useSfStablecoin();
    const [troves, setTroves] = useState<UserTrove[]>([]);
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

        sfStablecoin
            .getTroves({
                first: pageSize,
                sortedBy: 'ascendingCollateralRatio',
                startingAt: clampedPage * pageSize,
            })
            .then(troves => {
                if (mounted) {
                    setTroves(troves);
                }
            });

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

    const handleLiquidate = (address: string) => {
        sfStablecoin.send.liquidate(address);
    };

    const getCollateralRatioColor = (ratio: Decimal) => {
        if (ratio.lt(CRITICAL_COLLATERAL_RATIO))
            return 'bg-[#FFEBEB] text-[#D13333]'; // Red
        if (ratio.lt(MINIMUM_COLLATERAL_RATIO))
            return 'bg-[#FFF8E6] text-[#A66F00]'; // Yellow
        return 'bg-[#EBFFEB] text-[#1F8F1F]'; // Green
    };

    const calculateCollateralRatio = (trove: UserTrove) => {
        return trove.collateralRatio(price);
    };
    const [copied, setCopied] = useState<string>();

    useEffect(() => {
        if (copied !== undefined) {
            let cancelled = false;

            navigator.clipboard.writeText(copied);

            setTimeout(() => {
                if (!cancelled) {
                    setCopied(undefined);
                }
            }, 2000);

            return () => {
                cancelled = true;
            };
        }
    }, [copied]);

    return (
        <div className='flex w-full flex-col'>
            <main className='container mx-auto flex-grow px-4 py-8'>
                <h1 className='text-2xl mb-4 font-bold'>Risky Troves</h1>
                <p className='mb-8 max-w-3xl text-[#565656]'>
                    Track and liquidate risky Troves to maintain protocol
                    stability and earn rewards. Troves with a collateral ratio
                    below 110% (or 150% in Recovery Mode) are at risk, meaning
                    their FIL collateral may not fully cover their debt.
                </p>

                <div className='overflow-x-auto'>
                    <table className='w-full rounded-xl bg-white '>
                        <thead>
                            <tr className='text-left text-sm text-[#565656]'>
                                <th className='px-4 py-4 font-medium'>
                                    Address
                                </th>
                                <th className='px-4 py-4 font-medium'>
                                    Collateral (FIL)
                                </th>
                                <th className='px-4 py-4 font-medium'>
                                    Debt (USDFC)
                                </th>
                                <th className='px-4 py-4 font-medium'>
                                    Collateral Ratio
                                </th>
                                <th className='px-4 py-4 font-medium'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {troves.map((trove, index) => (
                                <tr
                                    key={index}
                                    className={clsx(
                                        'border-t border-[#f0f0f0]',
                                        index % 2 === 0
                                            ? 'bg-[#FAFAFA]'
                                            : 'bg-[#FFFFFF]'
                                    )}
                                >
                                    <td className='px-4 py-4'>
                                        <div className='flex items-center'>
                                            <span>
                                                {AddressUtils.format(
                                                    trove.ownerAddress,
                                                    6
                                                )}
                                            </span>
                                            <button
                                                className='ml-2 text-[#565656] hover:text-primary-500'
                                                onClick={() =>
                                                    setCopied(
                                                        trove.ownerAddress
                                                    )
                                                }
                                            >
                                                {copied ===
                                                trove.ownerAddress ? (
                                                    <CheckIcon
                                                        size={12}
                                                        className='text-success-700'
                                                    />
                                                ) : (
                                                    <Copy size={12} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className='px-4 py-4'>
                                        {trove.collateral.prettify()}
                                    </td>
                                    <td className='px-4 py-4'>
                                        {trove.debt.prettify()}
                                    </td>
                                    <td className='px-4 py-4'>
                                        <span
                                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getCollateralRatioColor(
                                                calculateCollateralRatio(trove)
                                            )}`}
                                        >
                                            {new Percent(
                                                calculateCollateralRatio(trove)
                                            ).prettify()}
                                        </span>
                                    </td>
                                    <td className='px-4 py-4'>
                                        <div className='w-full'>
                                            {index === 0 && !isConnected ? (
                                                <button
                                                    onClick={() => open()}
                                                    className='w-full rounded-xl border border-[#E3E3E3] bg-[#F0F0F0] px-4 py-2 text-sm text-[#000000] hover:bg-[#e5e5e5]'
                                                >
                                                    Connect wallet
                                                </button>
                                            ) : (
                                                <button
                                                    className='w-full rounded-xl border border-[#E3E3E3] bg-[#F0F0F0] px-4 py-2 text-sm text-[#808080] hover:bg-[#e5e5e5]'
                                                    onClick={() =>
                                                        handleLiquidate(
                                                            trove.ownerAddress
                                                        )
                                                    }
                                                >
                                                    Liquidate Trove
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
