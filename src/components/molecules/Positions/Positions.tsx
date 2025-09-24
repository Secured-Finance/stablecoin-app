import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import { Layers2, Vault } from 'lucide-react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
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
            <h2 className='text-2xl mb-3 text-left font-semibold leading-none text-neutral-900'>
                My Positions
            </h2>
            <div className='grid grid-cols-1 gap-3 tablet:grid-cols-2'>
                <PositionInfoCard icon={Vault} title='Trove'>
                    <InfoBlock
                        label='Total Debt'
                        value={
                            <>
                                {trove.debt.prettify()} <USDFCIcon />{' '}
                                <span>USDFC</span>
                            </>
                        }
                    />
                    <div className='space-y-3 text-sm text-neutral-700'>
                        <InfoRow
                            label='Collateral'
                            value={
                                <span className='flex items-center gap-1'>
                                    {trove.collateral.prettify()} <FILIcon />
                                    <span>FIL</span>
                                </span>
                            }
                        />
                        <InfoRow
                            label='Collateral Ratio'
                            value={
                                collateralRatio
                                    ? `${collateralRatio.mul(100).prettify(1)}%`
                                    : '%'
                            }
                        />
                        <InfoRow
                            label='Liquidation Risk'
                            value={
                                <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                                    Low
                                </span>
                            }
                        />
                    </div>
                    <Button
                        href='/trove'
                        data-testid='button-link'
                        size={ButtonSizes.md}
                        variant={ButtonVariants.tertiary}
                        className='mt-3 w-full'
                        external={false}
                    >
                        Manage Trove
                    </Button>
                </PositionInfoCard>

                <PositionInfoCard icon={Layers2} title='Stability Pool'>
                    <InfoBlock
                        label='Liquidation Gain'
                        value={`${liquidationGains}`}
                        icon={
                            <>
                                <FILIcon />
                                <span>FIL</span>
                            </>
                        }
                    />
                    <div className='space-y-3 text-sm text-neutral-700'>
                        <InfoRow
                            label='Deposit'
                            value={
                                <span className='flex items-center gap-1'>
                                    {originalDeposit.currentDebtToken.prettify()}{' '}
                                    <USDFCIcon />
                                    <span>USDFC</span>
                                </span>
                            }
                        />
                        <InfoRow
                            label='Pool Share'
                            value={`${originalPoolShare.prettify()}%`}
                        />
                    </div>
                    <div className='mt-6 flex gap-3'>
                        <Button
                            href='/stability-pool'
                            size={ButtonSizes.md}
                            variant={ButtonVariants.tertiary}
                            className='mt-3 w-full'
                            external={false}
                        >
                            Manage Deposit
                        </Button>
                        <Button
                            className='mt-3 w-full'
                            size={ButtonSizes.md}
                            variant={ButtonVariants.secondary}
                        >
                            Claim Gains
                        </Button>
                    </div>
                </PositionInfoCard>
            </div>
        </div>
    );
};

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <div className='flex justify-between'>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

const InfoBlock = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <div className='mb-6'>
        <p className='text-sm text-neutral-600'>{label}</p>
        <div className='text-2xl flex items-center gap-2 font-semibold text-neutral-900'>
            {value}
            {icon}
        </div>
    </div>
);
