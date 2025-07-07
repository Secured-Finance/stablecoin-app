import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    MINIMUM_COLLATERAL_RATIO,
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

interface CoreTableProps {
    troves: UserTrove[];
    price: Decimal;
    isConnected: boolean;
    sfStablecoin: EthersSfStablecoinWithStore<BlockPolledSfStablecoinStore>;
    open: () => void;
}

interface TroveRowProps {
    trove: UserTrove;
    price: Decimal;
    isConnected: boolean;
    sfStablecoin: EthersSfStablecoinWithStore<BlockPolledSfStablecoinStore>;
    open: () => void;
    index: number;
}

interface CollateralRatioBadgeProps {
    ratio: Decimal;
}

// Utility function to determine collateral ratio color
const getCollateralRatioColor = (ratio: Decimal) => {
    if (ratio.lt(CRITICAL_COLLATERAL_RATIO))
        return 'bg-[#FFEBEB] text-[#D13333]'; // Red
    if (ratio.lt(MINIMUM_COLLATERAL_RATIO))
        return 'bg-[#FFF8E6] text-[#A66F00]'; // Yellow
    return 'bg-[#EBFFEB] text-[#1F8F1F]'; // Green
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
}: TroveRowProps) => {
    const [copied, setCopied] = useState<string | undefined>();

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
            <td className='px-4 py-4'>
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
            <td className='px-4 py-4'>{trove.collateral.prettify()}</td>
            <td className='px-4 py-4'>{trove.debt.prettify()}</td>
            <td className='px-4 py-4'>
                <CollateralRatioBadge ratio={calculateCollateralRatio(trove)} />
            </td>
            <td className='px-4 py-4'>
                <div className='max-w-56'>
                    {index === 0 && !isConnected ? (
                        <button
                            onClick={open}
                            className='w-60 truncate rounded-xl border border-[#E3E3E3] bg-[#F0F0F0] px-4 py-2 text-sm text-[#000000] hover:bg-[#e5e5e5]'
                        >
                            Connect wallet
                        </button>
                    ) : (
                        <Transaction
                            id={`liquidate-${trove.ownerAddress}-${index}`}
                            send={overrides =>
                                sfStablecoin.send.liquidate(
                                    trove.ownerAddress,
                                    overrides
                                )
                            }
                        >
                            <button
                                className='w-60 truncate rounded-xl border border-[#E3E3E3] bg-[#F0F0F0] px-4 py-2 text-sm text-[#808080] hover:bg-[#e5e5e5]'
                                disabled={!isConnected}
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
    return (
        <div className='overflow-x-auto'>
            <table className='w-full rounded-xl bg-white'>
                <thead>
                    <tr className='text-left text-sm text-[#565656]'>
                        <th className='px-4 py-4 font-medium'>Address</th>
                        <th className='px-4 py-4 font-medium'>
                            Collateral (FIL)
                        </th>
                        <th className='px-4 py-4 font-medium'>Debt (USDFC)</th>
                        <th className='px-4 py-4 font-medium'>
                            Collateral Ratio
                        </th>
                        <th className='px-4 py-4 font-medium'></th>
                    </tr>
                </thead>
                <tbody>
                    {troves.map((trove, index) => (
                        <TroveRow
                            key={index}
                            trove={trove}
                            price={price}
                            isConnected={isConnected}
                            sfStablecoin={sfStablecoin}
                            open={open}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
