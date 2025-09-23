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
import { CheckIcon, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Button,
    ButtonVariants,
    LinkButton,
    Tooltip,
} from 'src/components/atoms';
import { Transaction } from 'src/components/Transaction';
import { AddressUtils } from 'src/utils';
import { Spinner } from 'theme-ui';
import RedoIcon from 'src/assets/icons/refresh.svg';
import { useSfStablecoin } from 'src/hooks';
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
    isConnected: boolean;
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
    isConnected,
    sfStablecoin,
    index,
    recoveryMode,
    totalCollateralRatio,
    debtTokenInStabilityPool,
}: TroveRowProps) => {
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

    const calculateCollateralRatio = (trove: UserTrove) =>
        trove.collateralRatio(price);

    return (
        <tr
            className={clsx(
                'border-t border-[#f0f0f0]',
                index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-[#FFFFFF]'
            )}
        >
            <td className='min-w-36 p-4 '>
                <div className='flex items-center gap-3 laptop:justify-center'>
                    <Tooltip
                        iconElement={
                            <span className='inline-block w-[100px] font-numerical'>
                                {AddressUtils.format(trove.ownerAddress, 6)}
                            </span>
                        }
                        placement='top'
                    >
                        {trove.ownerAddress}
                    </Tooltip>

                    <button onClick={() => setCopied(trove.ownerAddress)}>
                        {copied === trove.ownerAddress ? (
                            <CheckIcon className='h-4 w-4 text-success-700' />
                        ) : (
                            <Copy className='h-4 w-4 text-gray-400' />
                        )}
                    </button>
                </div>
            </td>
            <td className='min-w-30 p-4 text-center'>
                {trove.collateral.prettify()}
            </td>
            <td className='min-w-30 p-4 text-center'>
                {trove.debt.prettify()}
            </td>
            <td className='min-w-30 p-4 text-center'>
                <CollateralRatioBadge ratio={calculateCollateralRatio(trove)} />
            </td>
            <td className='min-w-30 p-4 text-center'>
                {trove.debtInFront?.prettify()}
            </td>
            <td className='min-w-[180px] p-4'>
                <div className='flex justify-center truncate'>
                    <Transaction
                        id='liquidate'
                        tooltip='Liquidate'
                        requires={[
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
                        <Button
                            variant={ButtonVariants.tertiary}
                            className='h-10 w-36 truncate rounded-xl border border-[#E3E3E3] bg-[#FAFAFA] px-3 py-1.5 text-sm font-medium text-[#565656] hover:bg-[#F0F0F0] hover:text-[#333333] disabled:cursor-not-allowed disabled:border-[#E3E3E3] disabled:bg-[#F7F7F7] disabled:text-[#B0B0B0]'
                            disabled={!isConnected}
                        >
                            Liquidate Trove
                        </Button>
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
    const { isConnected } = useAccount();

    return (
        <div className='w-full rounded-xl border border-gray-200'>
            <table className='w-full bg-white'>
                <thead className='border-b border-gray-200 bg-white'>
                    <tr className='text-left text-sm text-[#565656]'>
                        <th className='min-w-[150px] p-4 text-center'>
                            Address
                        </th>
                        <th className='min-w-30 p-4 text-center'>
                            Collateral (FIL)
                        </th>
                        <th className='min-w-30 p-4 text-center'>
                            Debt (USDFC)
                        </th>
                        <th className='min-w-30 p-4 text-center'>
                            Collateral Ratio
                        </th>
                        <th className='min-w-30 relative p-4 text-center'>
                            <span className='group inline-block'>
                                Debt In Front
                                <div className='pointer-events-none absolute left-0 top-full z-10 ml-6 w-56 rounded border bg-white p-2 text-left text-xs text-gray-800 opacity-0 transition-opacity group-hover:opacity-100'>
                                    It totals the debt of all troves that face
                                    higher liquidation risk—that is, those with
                                    lower collateral ratios—than the current
                                    trove.
                                </div>
                            </span>
                        </th>
                        <th className='min-w-[180px] p-4 text-center'></th>
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
                                key={index}
                                trove={trove}
                                price={price}
                                isConnected={isConnected}
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

            {troves.length >= 0 && (
                <div className='flex items-center justify-between border-t border-[#f0f0f0] p-4'>
                    <div className='flex items-center'>
                        <LinkButton
                            onClick={onPrevious}
                            disabled={currentPage === 1}
                            leftIcon={<ChevronLeft size={16} />}
                        >
                            Previous
                        </LinkButton>
                        <LinkButton
                            onClick={onNext}
                            disabled={currentPage === totalPages}
                            rightIcon={<ChevronRight size={16} />}
                            className='ml-4'
                        >
                            Next
                        </LinkButton>
                    </div>
                    <div className='flex items-center justify-between gap-2 text-sm text-[#565656]'>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>

                        <div className='flex items-center'>
                            <button
                                className='flex h-6 w-6 items-center justify-center'
                                onClick={forceReload}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner size={20} />
                                ) : (
                                    <RedoIcon size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
