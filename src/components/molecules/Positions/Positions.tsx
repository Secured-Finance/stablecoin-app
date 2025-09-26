import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import { Layers2, Vault } from 'lucide-react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { CURRENCY } from 'src/strings';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import { EmptyPosition } from '../EmptyPosition';
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

    // Calculate liquidation risk based on collateral ratio
    const getLiquidationRisk = (ratio?: Decimal) => {
        if (!ratio)
            return {
                text: 'Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                containerStyle: 'bg-[#FFF7E0] border border-[#FFE4A3]',
                textStyle: 'text-[#5C2E00] text-sm font-medium',
                dotStyle: 'bg-[#FFAD00]',
            };
        return {
            text: 'High',
            containerStyle: 'bg-[#FFE4E1] border border-[#FFACA3]',
            textStyle: 'text-[#5C0000] text-sm font-medium',
            dotStyle: 'bg-[#FF4D4F]',
        };
    };

    const liquidationRisk = getLiquidationRisk(collateralRatio);

    const liquidationGains = originalDeposit.collateralGain.prettify(2);
    const originalPoolShare = originalDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );

    const hasTrove = !trove.isEmpty;
    const hasStabilityDeposit = !originalDeposit.currentDebtToken.isZero;

    return (
        <div>
            <h2 className='text-2xl mb-3 text-left font-semibold leading-none text-neutral-900'>
                My Positions
            </h2>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6'>
                {hasTrove ? (
                    <PositionInfoCard icon={Vault} title='Trove'>
                        <div className='flex flex-col'>
                            <div className='h-24'>
                                <InfoBlock
                                    label='Total Debt'
                                    value={trove.debt.prettify()}
                                    icon={
                                        <>
                                            <USDFCIcon />
                                            <span>USDFC</span>
                                        </>
                                    }
                                />
                            </div>
                            <div className='h-24 space-y-3 text-sm text-neutral-700'>
                                <InfoRow
                                    label='Collateral'
                                    value={
                                        <span className='flex items-center gap-1'>
                                            {trove.collateral.prettify()}{' '}
                                            <FILIcon className='h-4 w-4' />
                                            <span>{CURRENCY}</span>
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label='Collateral Ratio'
                                    value={
                                        collateralRatio
                                            ? `${collateralRatio
                                                  .mul(100)
                                                  .prettify(1)}%`
                                            : '%'
                                    }
                                />
                                <InfoRow
                                    label='Liquidation Risk'
                                    value={
                                        <div
                                            className={`inline-flex items-center rounded-full ${liquidationRisk.containerStyle}`}
                                            style={{ padding: '6px 12px 6px 6px', gap: '6px' }}
                                        >
                                            <div
                                                className={`rounded-full ${liquidationRisk.dotStyle}`}
                                                style={{ width: '16px', height: '16px' }}
                                            ></div>
                                            <span className={liquidationRisk.textStyle}>
                                                {liquidationRisk.text}
                                            </span>
                                        </div>
                                    }
                                />
                            </div>
                            <div className='mt-auto'>
                                <Button
                                    href='/trove'
                                    data-testid='button-link'
                                    size={ButtonSizes.md}
                                    variant={ButtonVariants.tertiary}
                                    className='w-full text-sm font-semibold'
                                    external={false}
                                >
                                    Manage Trove
                                </Button>
                            </div>
                        </div>
                    </PositionInfoCard>
                ) : (
                    <EmptyPosition
                        icon={Vault}
                        title='Trove Yet'
                        description={`A Trove is your personal vault where you can deposit ${CURRENCY} as collateral to borrow USDFC with 0% interest, while maintaining exposure to ${CURRENCY}.`}
                        buttonText='Create Trove'
                        buttonHref='/trove'
                    />
                )}

                {hasStabilityDeposit ? (
                    <PositionInfoCard icon={Layers2} title='Stability Pool'>
                        <div className='flex flex-col'>
                            <div className='h-24'>
                                <InfoBlock
                                    label='Liquidation Gain'
                                    value={liquidationGains}
                                    icon={
                                        <>
                                            <FILIcon className='h-4 w-4' />
                                            <span>{CURRENCY}</span>
                                        </>
                                    }
                                />
                            </div>
                            <div className='h-24 space-y-3 text-sm text-neutral-700'>
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
                            <div className='mt-auto'>
                                <div className='flex gap-2 tablet:gap-3'>
                                    <Button
                                        href='/stability-pool'
                                        size={ButtonSizes.md}
                                        variant={ButtonVariants.tertiary}
                                        className='flex-1 text-xs font-semibold tablet:text-sm'
                                        external={false}
                                    >
                                        <span className='hidden tablet:inline'>
                                            Manage Deposit
                                        </span>
                                        <span className='inline tablet:hidden'>
                                            Manage
                                        </span>
                                    </Button>
                                    <Button
                                        className='flex-1 text-xs font-semibold tablet:text-sm'
                                        size={ButtonSizes.md}
                                        variant={ButtonVariants.primary}
                                    >
                                        <span className='hidden tablet:inline'>
                                            Claim Gains
                                        </span>
                                        <span className='inline tablet:hidden'>
                                            Claim
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PositionInfoCard>
                ) : (
                    <EmptyPosition
                        icon={Layers2}
                        title='Stability Pool Deposit Yet'
                        description={`Deposit USDFC to earn ${CURRENCY} rewards. The pool helps maintain system stability by covering liquidated debt, ensuring a balanced and secure ecosystem.`}
                        buttonText='Deposit'
                        buttonHref='/stability-pool'
                    />
                )}
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
        <span className='text-neutral-600'>{label}</span>
        <span className='font-medium'>{value}</span>
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
        <p className='mb-1 text-sm text-neutral-600'>{label}</p>
        <div className='text-2xl flex items-center gap-2 font-semibold text-neutral-900'>
            <span>{value}</span>
            <div className='flex items-center gap-1 text-base'>{icon}</div>
        </div>
    </div>
);
