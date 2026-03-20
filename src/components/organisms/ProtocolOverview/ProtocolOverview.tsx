import { Decimal, Percent, Trove } from '@secured-finance/stablecoin-lib-base';
import packageJson from 'package.json';
import { useEffect, useState } from 'react';
import TrendingUpIcon from 'src/assets/icons/trending-up.svg';
import { TokenPrice } from 'src/components/atoms';
import { Transaction } from 'src/components/Transaction';
import {
    ProtocolStat,
    ProtocolStats,
    RecoveryMode,
    VersionStats,
} from 'src/components/molecules';
import {
    BLOCKCHAIN_EXPLORER_LINKS,
    PYTH_ORACLE_LINK,
    TELLOR_ORACLE_LINKS,
} from 'src/constants';
import { useSfStablecoin } from 'src/hooks';
import { getSetPriceEnabled, isProdEnv, getFrontendTag } from 'src/utils';
import { CURRENCY } from 'src/strings';
import { filecoin } from 'viem/chains';
import { useAccount } from 'wagmi';

type ProtocolOverviewProps = {
    data: {
        numberOfTroves: number;
        price: Decimal;
        total: Trove;
        debtTokenInStabilityPool: Decimal;
        borrowingRate: Decimal;
        redemptionRate: Decimal;
        totalStakedProtocolToken: Decimal;
        kickbackRate: Decimal | null;
    };
    contextData: {
        addresses: Record<string, string>;
        chainId: number;
        deploymentDate: Date;
    };
};

export const ProtocolOverview = ({
    data,
    contextData,
}: ProtocolOverviewProps) => {
    const {
        sfStablecoin: {
            send: sfStablecoin,
            connection: { _priceFeedIsTestnet },
        },
    } = useSfStablecoin();

    const { isConnected, address } = useAccount();
    const isFrontendTag =
        address?.toLowerCase() === getFrontendTag().toLowerCase();
    const canSetPrice =
        _priceFeedIsTestnet && getSetPriceEnabled() && isFrontendTag;

    const [editedPrice, setEditedPrice] = useState(data.price.toString(2));

    useEffect(() => {
        setEditedPrice(data.price.toString(2));
    }, [data.price]);

    const displayPrice = (() => {
        try {
            const parsed = parseFloat(editedPrice);
            if (isNaN(parsed) || parsed < 0 || editedPrice.trim() === '') {
                return data.price.shorten();
            }
            return Decimal.from(editedPrice).shorten();
        } catch {
            return data.price.shorten();
        }
    })();

    const isRecoveryMode = data.total.collateralRatioIsBelowCritical(
        data.price
    );

    const priceSources = [
        { name: 'Pyth', href: PYTH_ORACLE_LINK },
        {
            name: 'Tellor',
            href:
                contextData.chainId === filecoin.id
                    ? TELLOR_ORACLE_LINKS.mainnet
                    : TELLOR_ORACLE_LINKS.testnet,
        },
    ];

    return (
        <div className='flex flex-col gap-5'>
            <h2 className='text-left text-5 font-semibold leading-none text-neutral-900'>
                Protocol Overview
            </h2>
            <div className='flex flex-col gap-6'>
                <div className='rounded-xl border border-neutral-9 bg-white p-6'>
                    <TokenPrice
                        symbol={CURRENCY}
                        price={editedPrice}
                        displayPrice={displayPrice}
                        sources={priceSources}
                        canSetPrice={canSetPrice && isConnected}
                        onPriceChange={setEditedPrice}
                        setPriceAction={
                            canSetPrice &&
                            isConnected && (
                                <Transaction
                                    id='set-price-protocol'
                                    tooltip='Set'
                                    tooltipPlacement='bottom'
                                    send={overrides => {
                                        if (!editedPrice) {
                                            throw new Error('Invalid price');
                                        }
                                        return sfStablecoin.setPrice(
                                            Decimal.from(editedPrice),
                                            overrides
                                        );
                                    }}
                                >
                                    <button>
                                        <TrendingUpIcon />
                                    </button>
                                </Transaction>
                            )
                        }
                    />
                </div>

                <div className='rounded-xl border border-neutral-9 bg-white p-6'>
                    <RecoveryMode isActive={isRecoveryMode} />
                </div>

                <div className='overflow-hidden rounded-xl border border-neutral-9 bg-white'>
                    <ProtocolStats
                        stats={getProtocolStats(data, contextData)}
                    />
                </div>

                <div className='overflow-hidden rounded-xl border border-neutral-9 bg-white'>
                    <VersionStats stats={getProtocolStats(data, contextData)} />
                </div>
            </div>
        </div>
    );
};

const formatStat = (
    label: string,
    value: string,
    subValue?: string,
    link?: string
): ProtocolStat => ({
    label,
    value,
    ...(subValue && { subValue }),
    ...(link && { link }),
});

export const getProtocolStats = (
    data: {
        numberOfTroves: number;
        price: Decimal;
        total: Trove;
        debtTokenInStabilityPool: Decimal;
        borrowingRate: Decimal;
        redemptionRate: Decimal;
        totalStakedProtocolToken: Decimal;
        kickbackRate: Decimal | null;
    },
    contextData?: {
        addresses: Record<string, string>;
        chainId: number;
        deploymentDate: Date;
    }
) => {
    const {
        numberOfTroves,
        price,
        total,
        debtTokenInStabilityPool,
        borrowingRate,
    } = data;

    const borrowingFeePct = new Percent(borrowingRate);
    const debtTokenInStabilityPoolPct = total.debt.nonZero
        ? new Percent(debtTokenInStabilityPool.div(total.debt))
        : null;
    const totalCollateralRatioPct = new Percent(total.collateralRatio(price));

    const fv = isProdEnv() ? packageJson.version : 'development';
    const stats: ProtocolStat[] = [
        formatStat(
            'Total Value Locked',
            `${total.collateral.shorten()} ${CURRENCY}`,
            `$${Decimal.from(total.collateral.mul(price)).shorten()}`
        ),
        formatStat('USDFC Supply', total.debt.shorten()),
        formatStat('Borrowing Fee', borrowingFeePct.toString(2)),
        formatStat(
            'Total Active Troves',
            Decimal.from(numberOfTroves).prettify(0)
        ),
        formatStat(
            'USDFC in Stability Pool',
            debtTokenInStabilityPool.shorten(),
            debtTokenInStabilityPoolPct
                ? `(${debtTokenInStabilityPoolPct.toString(1)})`
                : undefined
        ),
        formatStat(
            'Total Collateral Ratio',
            totalCollateralRatioPct.prettify()
        ),
        formatStat(
            'Smart Contract',
            (contextData?.addresses?.debtToken || '').slice(-7),
            undefined,
            contextData?.addresses?.debtToken
                ? `${
                      contextData.chainId === filecoin.id
                          ? BLOCKCHAIN_EXPLORER_LINKS.mainnet
                          : BLOCKCHAIN_EXPLORER_LINKS.testnet
                  }/en/address/${contextData.addresses.debtToken}`
                : undefined
        ),
        formatStat(
            'Frontend Version',
            fv,
            contextData?.deploymentDate?.toLocaleString()
        ),
    ];

    return {
        leftColumn: stats.slice(0, 3),
        rightColumn: stats.slice(3, 6),
        versionStats: stats.slice(6, stats.length),
    };
};
