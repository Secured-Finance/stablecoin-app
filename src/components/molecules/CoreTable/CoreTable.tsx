import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    Percent,
    UserTrove,
} from '@secured-finance/stablecoin-lib-base';
import {
    BlockPolledSfStablecoinStore,
    EthersSfStablecoinWithStore,
} from '@secured-finance/stablecoin-lib-ethers';
import clsx from 'clsx';
import { CheckIcon, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Transaction } from 'src/components/Transaction';
import { AddressUtils } from 'src/utils';

type TroveWithDebtInFront = UserTrove & { debtInFront: Decimal };
interface CoreTableProps {
    troves: TroveWithDebtInFront[];
    price: Decimal;
    isConnected: boolean;
    sfStablecoin: EthersSfStablecoinWithStore<BlockPolledSfStablecoinStore>;
    open: () => void;
}

interface TroveRowProps {
    trove: TroveWithDebtInFront;
    price: Decimal;
    isConnected: boolean;
    sfStablecoin: EthersSfStablecoinWithStore<BlockPolledSfStablecoinStore>;
    open: () => void;
    index: number;
    currentTxId: string | null;
    setCurrentTxId: (txId: string | null) => void;
}

interface CollateralRatioBadgeProps {
    ratio: Decimal;
}

// Utility function to determine collateral ratio color
const getCollateralRatioColor = (ratio: Decimal) => {
    if (ratio.gt(CRITICAL_COLLATERAL_RATIO))
        return 'bg-success-100 text-success-700';
    if (ratio.gt(1.2)) return 'bg-yellow-100 text-warning-700';
    return 'bg-red-100 text-error-700';
};

const CollateralRatioBadge = ({ ratio }: CollateralRatioBadgeProps) => {
    return (
        <span
            className={clsx(
                'inline-block rounded-full px-2 py-1 text-xs font-medium',
                getCollateralRatioColor(ratio)
            )}
        >
            {new Percent(ratio).prettify()}
        </span>
    );
};

const TroveRow = ({
    trove,
    price,
    isConnected,
    sfStablecoin,
    open,
    index,
    currentTxId,
    setCurrentTxId,
}: TroveRowProps) => {
    const [copied, setCopied] = useState<string | undefined>();

    const txId = `liquidate-${trove.ownerAddress}-${index}`;

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

    const calculateCollateralRatio = (trove: UserTrove) => {
        return trove.collateralRatio(price);
    };

    return (
        <tr
            className={clsx(
                'border-t border-[#f0f0f0]',
                index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-[#FFFFFF]'
            )}
        >
            <td className='p-4'>
                <div className='flex items-center'>
                    <span>{AddressUtils.format(trove.ownerAddress, 6)}</span>
                    <button
                        className='ml-2 text-[#565656] hover:text-primary-500'
                        onClick={() => setCopied(trove.ownerAddress)}
                    >
                        {copied === trove.ownerAddress ? (
                            <CheckIcon size={12} className='text-success-700' />
                        ) : (
                            <Copy size={12} />
                        )}
                    </button>
                </div>
            </td>
            <td className='p-4'>{trove.collateral.prettify()}</td>
            <td className='p-4'>{trove.debt.prettify()}</td>
            <td className='p-4'>
                <CollateralRatioBadge ratio={calculateCollateralRatio(trove)} />
            </td>
            <td className='p-4'>{trove.debtInFront?.prettify()}</td>

            <td className='px-2 py-4'>
                <div className='items-end laptop:w-56'>
                    {index === 0 && !isConnected ? (
                        <button
                            onClick={open}
                            className='truncate rounded-xl border border-[#E3E3E3] bg-primary-500 px-4 py-2 text-sm text-[#fff] laptop:w-56'
                        >
                            Connect wallet
                        </button>
                    ) : (
                        <Transaction
                            id={txId}
                            send={async overrides => {
                                setCurrentTxId(txId);
                                try {
                                    const tx =
                                        await sfStablecoin.send.liquidate(
                                            trove.ownerAddress,
                                            overrides
                                        );
                                    return tx;
                                } finally {
                                    setCurrentTxId(null);
                                }
                            }}
                        >
                            <button
                                className='truncate rounded-xl border border-[#E3E3E3] bg-[#FAFAFA] px-4 py-2 text-sm text-[#565656] hover:bg-[#F0F0F0] hover:text-[#333333] disabled:cursor-not-allowed disabled:border-[#E3E3E3] disabled:bg-[#F7F7F7] disabled:text-[#B0B0B0] laptop:w-56'
                                disabled={
                                    !isConnected ||
                                    (currentTxId !== null &&
                                        currentTxId !== txId)
                                }
                            >
                                Liquidate Trove
                            </button>
                        </Transaction>
                    )}
                </div>
            </td>
        </tr>
    );
};

export const CoreTable = ({
    troves,
    price,
    isConnected,
    sfStablecoin,
    open,
}: CoreTableProps) => {
    const [currentTxId, setCurrentTxId] = useState<string | null>(null);

    return (
        <div className='overflow-auto rounded-xl border border-gray-200 laptop:overflow-hidden'>
            <table className='w-full bg-white'>
                <thead className='shadow sticky top-0 z-10 w-56 bg-white'>
                    <tr className='text-left text-sm text-[#565656]'>
                        <th className='p-4'>Address</th>
                        <th className='p-4'>Collateral (FIL)</th>
                        <th className='p-4'>Debt (USDFC)</th>
                        <th className='p-4'>Collateral Ratio</th>
                        <th className='relative p-4'>
                            <span className='group inline-block'>
                                Debt In Front
                                <div className='pointer-events-none absolute left-0 top-full z-10 ml-3 w-56 rounded border bg-white p-2 text-xs text-gray-600 opacity-0 transition-opacity group-hover:opacity-100'>
                                    It totals the debt of all troves that face
                                    higher liquidation risk—that is, those with
                                    lower collateral ratios—than the current
                                    trove.
                                </div>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {troves.length <= 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className='p-4 text-center text-gray-400'
                            >
                                No Data Available.
                            </td>
                        </tr>
                    ) : (
                        troves.map((trove, index) => (
                            <TroveRow
                                key={index}
                                trove={trove}
                                price={price}
                                isConnected={isConnected}
                                sfStablecoin={sfStablecoin}
                                open={open}
                                index={index}
                                currentTxId={currentTxId}
                                setCurrentTxId={setCurrentTxId}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
