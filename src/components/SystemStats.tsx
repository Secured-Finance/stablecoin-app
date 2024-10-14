import { AddressZero } from '@ethersproject/constants';
import { Decimal, LiquityStoreState, Percent } from '@secured-finance/lib-base';
import packageJson from 'package.json';
import React from 'react';
import { useLiquity, useLiquitySelector } from 'src/hooks';
import { isProdEnv } from 'src/utils';
import { Box, Card, Heading, Link, Text } from 'theme-ui';
import * as l from '../lexicon';
import { Statistic } from './Statistic';

const selectBalances = ({
    accountBalance,
    debtTokenBalance,
    lqtyBalance,
}: LiquityStoreState) => ({
    accountBalance,
    debtTokenBalance,
    lqtyBalance,
});

const Balances: React.FC = () => {
    const { accountBalance, debtTokenBalance, lqtyBalance } =
        useLiquitySelector(selectBalances);

    return (
        <Box sx={{ mb: 3 }}>
            <Heading>My Account Balances</Heading>
            <Statistic lexicon={l.tFIL}>{accountBalance.prettify(4)}</Statistic>
            <Statistic lexicon={l.USDFC}>
                {debtTokenBalance.prettify()}
            </Statistic>
            <Statistic lexicon={l.SCR}>{lqtyBalance.prettify()}</Statistic>
        </Box>
    );
};

const GitHubCommit: React.FC<{ children?: string }> = ({ children }) =>
    children?.match(/[0-9a-f]{40}/) ? (
        <Link
            href={`https://github.com/Secured-Finance/stablecoin-contracts/commit/${children}`}
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
    totalStakedLQTY,
    frontend,
}: LiquityStoreState) => ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedLQTY,
    kickbackRate:
        frontend.status === 'registered' ? frontend.kickbackRate : null,
});

export const SystemStats: React.FC<SystemStatsProps> = ({
    variant = 'info',
    showBalances,
}) => {
    const {
        liquity: {
            connection: {
                version: contractsVersion,
                deploymentDate,
                frontendTag,
            },
        },
    } = useLiquity();

    const {
        numberOfTroves,
        price,
        debtTokenInStabilityPool,
        total,
        borrowingRate,
        totalStakedLQTY,
        kickbackRate,
    } = useLiquitySelector(select);

    const debtTokenInStabilityPoolPct =
        total.debt.nonZero &&
        new Percent(debtTokenInStabilityPool.div(total.debt));
    const totalCollateralRatioPct = new Percent(total.collateralRatio(price));
    const borrowingFeePct = new Percent(borrowingRate);
    const kickbackRatePct =
        frontendTag === AddressZero ? '100' : kickbackRate?.mul(100).prettify();

    return (
        <Card {...{ variant }}>
            {showBalances && <Balances />}

            <Heading>Statistics</Heading>

            <Heading as='h2' sx={{ mt: 3, fontWeight: 'body' }}>
                Protocol
            </Heading>

            <Statistic lexicon={l.BORROW_FEE}>
                {borrowingFeePct.toString(2)}
            </Statistic>

            <Statistic lexicon={l.TVL}>
                {total.collateral.shorten()}{' '}
                <Text sx={{ fontSize: 1 }}>&nbsp;tFIL</Text>
                <Text sx={{ fontSize: 1 }}>
                    &nbsp;($
                    {Decimal.from(total.collateral.mul(price)).shorten()})
                </Text>
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
                    <Text sx={{ fontSize: 1 }}>
                        &nbsp;({debtTokenInStabilityPoolPct.toString(1)})
                    </Text>
                </Statistic>
            )}
            <Statistic lexicon={l.STAKED_LQTY}>
                {totalStakedLQTY.shorten()}
            </Statistic>
            <Statistic lexicon={l.TCR}>
                {totalCollateralRatioPct.prettify()}
            </Statistic>
            <Statistic lexicon={l.RECOVERY_MODE}>
                {total.collateralRatioIsBelowCritical(price) ? (
                    <Box color='danger'>Yes</Box>
                ) : (
                    'No'
                )}
            </Statistic>
            {}

            <Heading as='h2' sx={{ mt: 3, fontWeight: 'body' }}>
                Frontend
            </Heading>
            {kickbackRatePct && (
                <Statistic lexicon={l.KICKBACK_RATE}>
                    {kickbackRatePct}%
                </Statistic>
            )}

            <Box sx={{ mt: 3, opacity: 0.66 }}>
                <Box sx={{ fontSize: 0 }}>
                    Contracts version:{' '}
                    <GitHubCommit>{contractsVersion}</GitHubCommit>
                </Box>
                <Box sx={{ fontSize: 0 }}>
                    Deployed: {deploymentDate.toLocaleString()}
                </Box>
                <Box sx={{ fontSize: 0 }}>
                    Frontend version:{' '}
                    {!isProdEnv() ? 'development' : packageJson.version}
                </Box>
            </Box>
        </Card>
    );
};
