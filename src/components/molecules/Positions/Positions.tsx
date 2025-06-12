import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import { Layers2, Vault } from 'lucide-react';
import { Link } from 'react-router-dom';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { SecuredFinanceLogo } from 'src/components/SecuredFinanceLogo';
import { PositionInfoCard } from '../PositionInfoCard';

interface PositionsProps {
    debtTokenInStabilityPool: Decimal;
    trove: Trove;
    price: Decimal;
    originalDeposit: {
        collateralGain: Decimal;
        currentDebtToken: Decimal;
    };
}

export const Positions = ({
    debtTokenInStabilityPool,
    trove,
    price,
    originalDeposit,
}: PositionsProps) => {
    const collateralRatio =
        !trove.collateral.isZero && !trove.netDebt.isZero
            ? trove.collateralRatio(price)
            : undefined;

    const liquidationGains = originalDeposit.collateralGain.prettify(2);
    const originalPoolShare = originalDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );

    return (
        <div>
            <h2 className='mb-3 font-primary text-5 font-semibold text-neutral-900'>
                My Positions
            </h2>
            <div className='grid grid-cols-1 gap-3 laptop:grid-cols-2'>
                <PositionInfoCard
                    icon={Vault}
                    title='Trove'
                    mainStat={{
                        label: 'Total Debt',
                        value: (
                            <div className='text-2xl flex items-center gap-1 font-semibold text-neutral-900'>
                                {trove.debt.prettify()} <SecuredFinanceLogo />
                            </div>
                        ),
                    }}
                    stats={[
                        {
                            label: 'Collateral',
                            value: `${trove.collateral.prettify()} FIL`,
                        },
                        {
                            label: 'Collateral Ratio',
                            value: collateralRatio
                                ? `${collateralRatio.mul(100).prettify()}%`
                                : '%',
                        },
                        {
                            label: 'Liquidation Risk',
                            value: (
                                <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                                    Low
                                </span>
                            ),
                        },
                    ]}
                    to='/trove'
                    buttonText='Manage Trove'
                    buttonVariant='ghost'
                />

                <PositionInfoCard
                    icon={Layers2}
                    title='Stability Pool'
                    mainStat={{
                        label: 'Liquidation Gain',
                        value: (
                            <div className='text-lg flex items-center gap-2 font-semibold text-neutral-900'>
                                {liquidationGains} <FILIcon />
                                FIL
                            </div>
                        ),
                    }}
                    stats={[
                        {
                            label: 'Deposit',
                            value: (
                                <div className='flex items-center gap-1'>
                                    {originalDeposit.currentDebtToken.prettify()}{' '}
                                    <span>USDFC</span>
                                </div>
                            ),
                        },
                        {
                            label: 'Pool Share',
                            value: `${originalPoolShare.prettify()}%`,
                        },
                    ]}
                    actions={
                        <>
                            <Link
                                to='/stability-pool'
                                className='w-full rounded-lg border border-neutral-300 bg-white py-2 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-50'
                            >
                                Manage Deposit
                            </Link>
                            <button className='w-full rounded-lg bg-primary-500 py-2 text-sm font-medium text-white hover:bg-blue-700'>
                                Claim Gains
                            </button>
                        </>
                    }
                />
            </div>
        </div>
    );
};
