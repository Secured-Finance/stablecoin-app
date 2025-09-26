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
import {
    CheckIcon,
    ChevronLeft,
    ChevronRight,
    Copy,
    RotateCw,
    Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    ButtonVariants,
    LinkButton,
    Tooltip,
} from 'src/components/atoms';
import { Transaction } from 'src/components/Transaction';
import { AddressUtils } from 'src/utils';
import { Spinner } from 'theme-ui';
import { useSfStablecoin } from 'src/hooks';
import { CURRENCY } from 'src/strings';
import { useAccount } from 'wagmi';

type TroveWithDebtInFront = UserTrove & { debtInFront: Decimal };
interface CoreTableProps {
    troves: TroveWithDebtInFront[];
    price: Decimal;
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
    loading: boolean;
    forceReload: () => void;
    recoveryMode: boolean;
    totalCollateralRatio: Decimal;
    debtTokenInStabilityPool: Decimal;
}

interface TroveRowProps {
    trove: TroveWithDebtInFront;
    price: Decimal;
    sfStablecoin: EthersSfStablecoinWithStore<BlockPolledSfStablecoinStore>;
    index: number;
    recoveryMode: boolean;
    totalCollateralRatio: Decimal;
    debtTokenInStabilityPool: Decimal;
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

const liquidatableInNormalMode = (trove: UserTrove, price: Decimal) =>
    [
        trove.collateralRatioIsBelowMinimum(price),
        'Collateral ratio not low enough',
    ] as const;

const liquidatableInRecoveryMode = (
    trove: UserTrove,
    price: Decimal,
    totalCollateralRatio: Decimal,
    debtTokenInStabilityPool: Decimal
) => {
    const collateralRatio = trove.collateralRatio(price);

    if (
        collateralRatio.gte(MINIMUM_COLLATERAL_RATIO) &&
        collateralRatio.lt(totalCollateralRatio)
    ) {
        return [
            trove.debt.lte(debtTokenInStabilityPool),
            "There's not enough token in the Stability pool to cover the debt",
        ] as const;
    } else {
        return liquidatableInNormalMode(trove, price);
    }
};

const TroveRow = ({
    trove,
    price,
    sfStablecoin,
    index,
    recoveryMode,
    totalCollateralRatio,
    debtTokenInStabilityPool,
}: TroveRowProps) => {
    const { isConnected } = useAccount();
    const [copied, setCopied] = useState<string | undefined>();

    useEffect(() => {
        if (copied !== undefined) {
            let cancelled = false;
            navigator.clipboard.writeText(copied);
            setTimeout(() => {
                if (!cancelled) setCopied(undefined);
            }, 2000);
            return () => {
                cancelled = true;
            };
        }
    }, [copied]);

    const calculateCollateralRatio = useCallback(
        (trove: UserTrove) => trove.collateralRatio(price),
        [price]
    );

    // Calculate if liquidation is disabled
    const liquidationRequirement = useMemo(
        () =>
            recoveryMode
                ? liquidatableInRecoveryMode(
                      trove,
                      price,
                      totalCollateralRatio,
                      debtTokenInStabilityPool
                  )
                : liquidatableInNormalMode(trove, price),
        [
            trove,
            price,
            recoveryMode,
            totalCollateralRatio,
            debtTokenInStabilityPool,
        ]
    );

    const isLiquidationDisabled = !isConnected || !liquidationRequirement[0];

    return (
        <tr
            className={clsx(
                'border-t border-[#f0f0f0]',
                index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-[#FFFFFF]'
            )}
        >
            <td className='p-1 tablet:p-4'>
                <div className='flex items-center justify-center'>
                    <Tooltip
                        iconElement={
                            <span className='font-numerical text-xs tablet:min-w-[80px] tablet:text-sm'>
                                {AddressUtils.format(trove.ownerAddress, 6)}
                            </span>
                        }
                        placement='top'
                    >
                        {trove.ownerAddress}
                    </Tooltip>

                    <button
                        onClick={() => setCopied(trove.ownerAddress)}
                        className='ml-0.5 tablet:ml-1'
                        aria-label={`Copy address ${AddressUtils.format(
                            trove.ownerAddress,
                            3
                        )}`}
                    >
                        {copied === trove.ownerAddress ? (
                            <CheckIcon className='h-3 w-3 text-success-700 tablet:h-4 tablet:w-4' />
                        ) : (
                            <Copy className='h-3 w-3 text-gray-400 tablet:h-4 tablet:w-4' />
                        )}
                    </button>
                </div>
            </td>
            <td className='p-1 text-center text-xs tablet:p-4 tablet:text-sm'>
                {trove.collateral.shorten()}
            </td>
            <td className='p-1 text-center text-xs tablet:p-4 tablet:text-sm'>
                {trove.debt.shorten()}
            </td>
            <td className='p-1 text-center tablet:p-4'>
                <CollateralRatioBadge ratio={calculateCollateralRatio(trove)} />
            </td>
            <td className='p-1 text-center text-xs tablet:p-4 tablet:text-sm'>
                ${trove.debtInFront?.shorten() ?? '0'}
            </td>
            <td className='p-1 tablet:p-4'>
                <div className='flex justify-center'>
                    <Transaction
                        id={`liquidate-${trove.ownerAddress}`}
                        tooltip='Liquidate'
                        requires={[
                            [isConnected, 'Please connect your wallet'],
                            recoveryMode
                                ? liquidatableInRecoveryMode(
                                      trove,
                                      price,
                                      totalCollateralRatio,
                                      debtTokenInStabilityPool
                                  )
                                : liquidatableInNormalMode(trove, price),
                        ]}
                        send={sfStablecoin.send.liquidate.bind(
                            sfStablecoin.send,
                            trove.ownerAddress
                        )}
                    >
                        <div>
                            {/* Mobile: Trash icon only */}
                            <button
                                className='p-1 text-error-500 disabled:text-neutral-600 tablet:hidden'
                                disabled={isLiquidationDisabled}
                                aria-label='Liquidate trove'
                            >
                                <Trash2 className='h-4 w-4' />
                            </button>

                            {/* Tablet+: Full liquidate button */}
                            <Button
                                variant={ButtonVariants.tertiary}
                                className='hidden h-10 w-36 truncate rounded-xl border border-[#E3E3E3] bg-[#FAFAFA] px-3 py-1.5 text-sm font-medium text-[#565656] hover:bg-[#F0F0F0] hover:text-[#333333] disabled:cursor-not-allowed disabled:border-[#E3E3E3] disabled:bg-[#E8E8E8] disabled:text-[#888888] tablet:block'
                                disabled={isLiquidationDisabled}
                            >
                                Liquidate Trove
                            </Button>
                        </div>
                    </Transaction>
                </div>
            </td>
        </tr>
    );
};

export const CoreTable = ({
    troves,
    price,
    currentPage,
    onNext,
    onPrevious,
    totalPages,
    loading,
    forceReload,
    recoveryMode,
    totalCollateralRatio,
    debtTokenInStabilityPool,
}: CoreTableProps) => {
    const { sfStablecoin } = useSfStablecoin();

    return (
        <div className='w-full overflow-hidden rounded-xl border border-gray-200 bg-white'>
            <table className='min-w-full table-fixed'>
                <thead className='shadow sticky top-0 z-10 border-b border-black-10 bg-white'>
                    <tr className='text-left text-xs text-[#565656] tablet:text-sm'>
                        <th className='p-1 text-center tablet:p-4'>
                            <span className='tablet:hidden'>Owner</span>
                            <span className='hidden tablet:inline'>
                                Address
                            </span>
                        </th>
                        <th className='p-1 text-center tablet:p-4'>
                            <div className='flex flex-col items-center'>
                                <span className='tablet:hidden'>Coll.</span>
                                <span className='hidden tablet:inline'>
                                    Collateral
                                </span>
                                <span className='text-xs font-normal text-neutral-500'>
                                    ({CURRENCY})
                                </span>
                            </div>
                        </th>
                        <th className='p-1 text-center tablet:p-4'>
                            <div className='flex flex-col items-center'>
                                <span>Debt</span>
                                <span className='text-xs font-normal text-neutral-500'>
                                    (USDFC)
                                </span>
                            </div>
                        </th>
                        <th className='p-1 text-center tablet:p-4'>
                            <span className='tablet:hidden'>
                                Coll.
                                <br />
                                Ratio
                            </span>
                            <span className='hidden tablet:inline'>
                                Collateral Ratio
                            </span>
                        </th>
                        <th className='relative p-1 text-center tablet:p-4'>
                            <span className='group inline-block'>
                                <span className='tablet:hidden'>
                                    Debt
                                    <br />
                                    In Front
                                </span>
                                <span className='hidden tablet:inline'>
                                    Debt In Front
                                </span>
                                <div className='pointer-events-none absolute right-0 top-full z-10 w-48 rounded border bg-white p-2 text-left text-xs text-gray-800 opacity-0 transition-opacity group-hover:opacity-100 tablet:left-0 tablet:right-auto tablet:ml-6 tablet:w-56'>
                                    It totals the debt of all troves that face
                                    higher liquidation risk—that is, those with
                                    lower collateral ratios—than the current
                                    trove.
                                </div>
                            </span>
                        </th>
                        <th className='p-1 text-center tablet:p-4'></th>
                    </tr>
                </thead>
                <tbody>
                    {troves.length <= 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className='p-4 text-center text-gray-400'
                            >
                                No Troves Available
                            </td>
                        </tr>
                    ) : (
                        troves.map((trove, index) => (
                            <TroveRow
                                key={`${trove.ownerAddress}-${index}`}
                                trove={trove}
                                price={price}
                                sfStablecoin={sfStablecoin}
                                index={index}
                                recoveryMode={recoveryMode}
                                totalCollateralRatio={totalCollateralRatio}
                                debtTokenInStabilityPool={
                                    debtTokenInStabilityPool
                                }
                            />
                        ))
                    )}
                </tbody>
            </table>

            <div className='flex items-center justify-between border-t border-[#f0f0f0] p-3 tablet:p-4'>
                <div className='flex items-center gap-2'>
                    <span className='text-xs text-[#565656] tablet:text-sm'>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                <div className='flex items-center gap-1'>
                    {/* Mobile: Icon-only buttons */}
                    <button
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        className='p-1 disabled:text-neutral-400 tablet:hidden'
                        aria-label='Previous page'
                    >
                        <ChevronLeft className='h-4 w-4' />
                    </button>

                    <button
                        onClick={onNext}
                        disabled={currentPage === totalPages}
                        className='p-1 disabled:text-neutral-400 tablet:hidden'
                        aria-label='Next page'
                    >
                        <ChevronRight className='h-4 w-4' />
                    </button>

                    {/* Tablet+: Text buttons */}
                    <LinkButton
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        leftIcon={<ChevronLeft size={16} />}
                        className='hidden tablet:flex'
                    >
                        Previous
                    </LinkButton>
                    <LinkButton
                        onClick={onNext}
                        disabled={currentPage === totalPages}
                        rightIcon={<ChevronRight size={16} />}
                        className='ml-4 hidden tablet:flex'
                    >
                        Next
                    </LinkButton>

                    <button
                        className='flex items-center justify-center p-1'
                        onClick={forceReload}
                        disabled={loading}
                        aria-label={loading ? 'Reloading...' : 'Reload data'}
                    >
                        {loading ? (
                            <Spinner size={16} />
                        ) : (
                            <RotateCw size={16} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
