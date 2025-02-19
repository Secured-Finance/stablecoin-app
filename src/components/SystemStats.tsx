import {
    Decimal,
    Percent,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import Link from 'next/link';
import packageJson from 'package.json';
import React, { useEffect, useState } from 'react';
import CheckIcon from 'src/assets/icons/check.svg';
import Clipboard from 'src/assets/icons/clipboard-line.svg';
import Wallet from 'src/assets/icons/wallet.svg';
import { BLOCKCHAIN_EXPLORER_LINKS } from 'src/constants';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { COIN, CURRENCY } from 'src/strings';
import {
    AddressUtils,
    COLLATERAL_PRECISION,
    DEBT_TOKEN_PRECISION,
} from 'src/utils';
import * as l from '../lexicon';
import { Statistic } from './Statistic';

const selectBalances = ({
    accountBalance,
    debtTokenBalance,
    protocolTokenBalance,
}: SfStablecoinStoreState) => ({
    accountBalance,
    debtTokenBalance,
    protocolTokenBalance,
});

const Balances = () => {
    const { accountBalance, debtTokenBalance } =
        useSfStablecoinSelector(selectBalances);

    return (
        <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-1'>
                <Wallet className='h-5 w-5' />
                <span className='typography-mobile-body-3 font-semibold capitalize text-neutral-900'>
                    My Account Balances
                </span>
            </div>
            <Statistic lexicon={l.FIL}>
                {accountBalance.prettify(COLLATERAL_PRECISION)}
            </Statistic>
            <Statistic lexicon={l.DEBT_TOKEN}>
                {debtTokenBalance.prettify(DEBT_TOKEN_PRECISION)}
            </Statistic>
            {/* <Statistic lexicon={l.PROTOCOL_TOKEN}>
                {protocolTokenBalance.prettify()}
            </Statistic> */}
        </div>
    );
};

const GitHubCommit: React.FC<{ children?: string }> = ({ children }) =>
    children?.match(/[0-9a-f]{40}/) ? (
        <Link
            href={`https://github.com/Secured-Finance/stablecoin-contracts/commit/${children}`}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Stablecoin Contracts Github'
            className='ml-1 font-semibold text-primary-500'
        >
            {children.substr(0, 7)}
        </Link>
    ) : (
        <>unknown</>
    );

type SystemStatsProps = {
    variant?: string;
    showBalances?: boolean;
};

const select = ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedProtocolToken,
    frontend,
}: SfStablecoinStoreState) => ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedProtocolToken,
    kickbackRate:
        frontend.status === 'registered' ? frontend.kickbackRate : null,
});

export const SystemStats: React.FC<SystemStatsProps> = ({ showBalances }) => {
    const {
        sfStablecoin: {
            connection: {
                version: contractsVersion,
                deploymentDate,
                addresses,
                chainId,
            },
        },
    } = useSfStablecoin();

    const {
        numberOfTroves,
        price,
        debtTokenInStabilityPool,
        total,
        borrowingRate,
    } = useSfStablecoinSelector(select);

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

    const debtTokenInStabilityPoolPct =
        total.debt.nonZero &&
        new Percent(debtTokenInStabilityPool.div(total.debt));
    const totalCollateralRatioPct = new Percent(total.collateralRatio(price));
    const borrowingFeePct = new Percent(borrowingRate);

    return (
        <div className='w-full min-w-0 rounded-lg bg-neutral-50 p-3 text-neutral-900 shadow-card laptop:px-4 laptop:pb-4 laptop:pt-3'>
            <div className='flex flex-col gap-3 laptop:gap-4'>
                <h2 className='typography-mobile-body-1 flex font-light laptop:hidden'>
                    My Info
                </h2>
                {showBalances && <Balances />}

                <h2 className='typography-mobile-body-1 flex items-center justify-between font-light text-neutral-800'>
                    Protocol Statistics
                </h2>

                <div className='flex flex-col gap-1'>
                    <Statistic lexicon={l.BORROW_FEE}>
                        {borrowingFeePct.toString(2)}
                    </Statistic>

                    <Statistic lexicon={l.TVL}>
                        {total.collateral.shorten()}
                        <span>&nbsp;{CURRENCY}</span>
                        <span>
                            &nbsp;($
                            {Decimal.from(
                                total.collateral.mul(price)
                            ).shorten()}
                            )
                        </span>
                    </Statistic>
                    <Statistic lexicon={l.TROVES}>
                        {Decimal.from(numberOfTroves).prettify(0)}
                    </Statistic>
                    <Statistic lexicon={l.DEBT_TOKEN_SUPPLY}>
                        {total.debt.shorten()}
                    </Statistic>
                    {debtTokenInStabilityPoolPct && (
                        <Statistic lexicon={l.STABILITY_POOL_DEBT_TOKEN}>
                            {debtTokenInStabilityPool.shorten()}
                            <span>
                                &nbsp;({debtTokenInStabilityPoolPct.toString(1)}
                                )
                            </span>
                        </Statistic>
                    )}
                    {/* <Statistic lexicon={l.STAKED_PROTOCOL_TOKEN}>
                        {totalStakedProtocolToken.shorten()}
                    </Statistic> */}
                    <Statistic lexicon={l.TCR}>
                        {totalCollateralRatioPct.prettify()}
                    </Statistic>
                    <Statistic lexicon={l.RECOVERY_MODE}>
                        {total.collateralRatioIsBelowCritical(price) ? (
                            <span className='text-red-500'>Yes</span>
                        ) : (
                            'No'
                        )}
                    </Statistic>
                </div>

                <div className='flex flex-col gap-1 text-2.5 leading-3.5 text-neutral-600'>
                    <div>
                        <span>Contracts version:</span>
                        <GitHubCommit>{contractsVersion}</GitHubCommit>
                    </div>
                    <div>
                        <span>{COIN} contract:</span>
                        <span className='relative ml-1 font-semibold text-primary-500'>
                            <Link
                                href={`${
                                    chainId === 314
                                        ? BLOCKCHAIN_EXPLORER_LINKS.mainnet
                                        : BLOCKCHAIN_EXPLORER_LINKS.testnet
                                }/en/address/${addresses.debtToken}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label={`${COIN} contract`}
                            >
                                {AddressUtils.format(addresses.debtToken, 8)}
                            </Link>
                            <button
                                className='absolute -right-5 top-1/2 -translate-y-1/2 transform'
                                onClick={() => setCopied(addresses.debtToken)}
                            >
                                {copied === addresses.debtToken ? (
                                    <CheckIcon className='h-4 w-4 text-success-700' />
                                ) : (
                                    <Clipboard className='h-4 w-4 text-primary-500' />
                                )}
                            </button>
                        </span>
                    </div>
                    <div>
                        <span>Deployed:</span>
                        <span className='ml-1 font-semibold'>
                            {deploymentDate.toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <span>Frontend version:</span>
                        <span className='ml-1 font-semibold'>
                            {/* {!isProdEnv() ? 'development' : packageJson.version} */}
                            {/* TODO: FIX before production launch */}
                            {packageJson.version}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
