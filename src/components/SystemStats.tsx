import {
    Decimal,
    Percent,
    SfStablecoinStoreState,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import Link from 'next/link';
import packageJson from 'package.json';
import React from 'react';
import Wallet from 'src/assets/icons/wallet.svg';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import {
    COLLATERAL_PRECISION,
    DEBT_TOKEN_PRECISION,
    isProdEnv,
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
                <Wallet className='h-6 w-6' />
                <span className='typography-mobile-body-3 font-semibold capitalize text-neutral-900'>
                    {t('common.my-account-balances')}
                </span>
            </div>
            <Statistic lexicon={l.tFIL}>
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
            connection: { version: contractsVersion, deploymentDate },
        },
    } = useSfStablecoin();

    const {
        numberOfTroves,
        price,
        debtTokenInStabilityPool,
        total,
        borrowingRate,
    } = useSfStablecoinSelector(select);

    const debtTokenInStabilityPoolPct =
        total.debt.nonZero &&
        new Percent(debtTokenInStabilityPool.div(total.debt));
    const totalCollateralRatioPct = new Percent(total.collateralRatio(price));
    const borrowingFeePct = new Percent(borrowingRate);

    return (
        <div className='w-full min-w-0 rounded-b-xl border border-t-2 border-primary-300 border-t-primary-500 bg-[linear-gradient(112deg,_#fff,_#f2f3fc)] px-3 pb-3 pt-2.5 text-neutral-900 shadow-stats laptop:border-[1.5px] laptop:border-t-4 laptop:px-4 laptop:pb-4 laptop:pt-3'>
            <div className='flex flex-col gap-3 laptop:gap-4'>
                <h2 className='typography-mobile-body-2 flex font-semibold laptop:hidden'>
                    {t('common.my-info')}
                </h2>
                {showBalances && <Balances />}

                <span className='typography-mobile-body-2 font-semibold text-neutral-900 laptop:text-base laptop:leading-6'>
                    {t('stablecoin-stats.title')}
                </span>

                <div className='flex flex-col gap-1'>
                    <span className='typography-mobile-body-3 laptop:typography-desktop-body-4 text-neutral-900'>
                        {t('common.protocol')}
                    </span>

                    <Statistic lexicon={l.BORROW_FEE}>
                        {borrowingFeePct.toString(2)}
                    </Statistic>

                    <Statistic lexicon={l.TVL}>
                        {total.collateral.shorten()}
                        <span>&nbsp;tFIL</span>
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
                            <span className='text-red-500'>
                                {t('common.yes')}
                            </span>
                        ) : (
                            t('common.no')
                        )}
                    </Statistic>
                </div>

                <div className='flex flex-col gap-1 text-2.5 leading-3.5 text-neutral-600'>
                    <div>
                        <span>{t('stablecoin-stats.contracts')}:</span>
                        <GitHubCommit>{contractsVersion}</GitHubCommit>
                    </div>
                    <div>
                        <span>
                            {t('stablecoin-stats.deployed')}:{' '}
                            {deploymentDate.toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <span>{t('stablecoin-stats.frontend')}:</span>
                        <span className='ml-1 font-semibold text-primary-500'>
                            {!isProdEnv() ? 'development' : packageJson.version}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
