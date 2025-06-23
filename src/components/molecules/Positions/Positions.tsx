import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import { Layers2, Vault } from 'lucide-react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
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
                <PositionInfoCard icon={Vault} title='Trove'>
                    <div className='mb-6'>
                        <p className='text-sm text-neutral-600'>Total Debt</p>
                        <div className='text-2xl flex items-center gap-1 font-semibold text-neutral-900'>
                            {trove.debt.prettify()} <SecuredFinanceLogo />
                        </div>
                    </div>
                    <div className='space-y-3 text-sm text-neutral-700'>
                        <div className='flex justify-between'>
                            <span>Collateral</span>
                            <span>{`${trove.collateral.prettify()} FIL`}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Collateral Ratio</span>
                            <span>
                                {collateralRatio
                                    ? `${collateralRatio.mul(100).prettify()}%`
                                    : '%'}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Liquidation Risk</span>
                            <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                                Low
                            </span>
                        </div>
                    </div>
                    <Button
                        href='/trove'
                        data-testid='button-link'
                        size={ButtonSizes.md}
                        variant={ButtonVariants.tertiary}
                        className='mt-3 w-full'
                    >
                        Manage Trove
                    </Button>
                </PositionInfoCard>

                <PositionInfoCard icon={Layers2} title='Stability Pool'>
                    <div className='mb-6'>
                        <p className='text-sm text-neutral-600'>
                            Liquidation Gain
                        </p>
                        <div className='text-lg flex items-center gap-2 font-semibold text-neutral-900'>
                            {liquidationGains} <FILIcon /> FIL
                        </div>
                    </div>
                    <div className='space-y-3 text-sm text-neutral-700'>
                        <div className='flex justify-between'>
                            <span>Deposit</span>
                            <span className='flex items-center gap-1'>
                                {originalDeposit.currentDebtToken.prettify()}{' '}
                                <span>USDFC</span>
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Pool Share</span>
                            <span>{`${originalPoolShare.prettify()}%`}</span>
                        </div>
                    </div>
                    <div className='mt-6 flex gap-3'>
                        <Button
                            href='/stability-pool'
                            size={ButtonSizes.md}
                            variant={ButtonVariants.tertiary}
                            className='mt-3 w-full'
                        >
                            Manage Deposit
                        </Button>
                        <Button
                            className='mt-3 w-full'
                            size={ButtonSizes.md}
                            variant={ButtonVariants.primary}
                        >
                            Claim Gains
                        </Button>
                    </div>
                </PositionInfoCard>
            </div>
        </div>
    );
};
