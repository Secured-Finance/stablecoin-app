import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import { InfoIcon, Layers2, Vault } from 'lucide-react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import {
    Button,
    ButtonSizes,
    ButtonVariants,
    CustomTooltip,
} from 'src/components/atoms';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import { openDocumentation } from 'src/constants';
import { CURRENCY } from 'src/strings';
import { EmptyPosition } from '../EmptyPosition';
import { useSfStablecoin } from 'src/hooks';
import {
    useTransactionFunction,
    useMyTransactionState,
} from '../../Transaction';

interface PositionsProps {
    debtTokenInStabilityPool: Decimal;
    trove: Trove;
    price: Decimal;
    originalDeposit: {
        collateralGain: Decimal;
        currentDebtToken: Decimal;
    };
    claimGainsButton?: React.ReactNode;
}

const Card = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`flex h-[496px] w-full max-w-[448px] flex-col gap-10 rounded-2xl border border-neutral-200 bg-white p-6 tablet:p-10 ${className}`}
    >
        {children}
    </div>
);

const CardHeader = ({
    icon,
    title,
    className,
    tooltip,
}: {
    icon: React.ReactNode;
    title: string;
    className?: string;
    tooltip?: {
        title: string;
        description: string;
        onButtonClick?: () => void;
    };
}) => (
    <div className='flex items-center justify-between'>
        <div className={`flex items-center gap-3 ${className ?? ''}`}>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-primary-500/20 bg-primary-500/5'>
                {icon}
            </div>
            <span className='text-5 font-semibold text-neutral-900'>
                {title}
            </span>
        </div>
        {}
        {tooltip && (
            <CustomTooltip
                title={tooltip.title}
                description={tooltip.description}
                onButtonClick={tooltip.onButtonClick}
                position='bottom'
            >
                <InfoIcon className='h-5 w-5 cursor-pointer text-neutral-400 hover:text-blue-500' />
            </CustomTooltip>
        )}
    </div>
);

const InfoBlock = ({
    label,
    value,
    icon,
    className,
}: {
    label: string;
    value: string;
    icon?: string | React.ReactNode;
    className?: string;
}) => (
    <div className={className}>
        <p className='mb-1 font-primary text-4 font-medium text-neutral-600'>
            {label}
        </p>
        <div className='flex items-center gap-2 text-6 text-neutral-900'>
            <span className='font-primary '>{value}</span>
            {icon}
        </div>
    </div>
);

const StatRow = ({
    label,
    value,
    icon,
    className,
}: {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`flex h-auto flex-col gap-1 tablet:h-12 tablet:flex-row tablet:items-center tablet:justify-between ${
            className ?? ''
        }`}
    >
        <span className='text-sm font-medium text-neutral-500'>{label}</span>
        <div className='flex items-center gap-2 font-medium text-neutral-900'>
            {typeof value === 'string' ? <span>{value}</span> : value}
            {icon}
        </div>
    </div>
);

const RiskBadge = ({
    text,
    containerStyle,
    textStyle,
    dotStyle,
}: {
    text: string;
    containerStyle: string;
    textStyle: string;
    dotStyle: string;
}) => (
    <div
        className={`inline-flex items-center rounded-full ${containerStyle} gap-2 px-3 py-1`}
    >
        <div className={`h-4 w-4 rounded-full ${dotStyle}`} />
        <span className={textStyle}>{text}</span>
    </div>
);

const ActionRow = ({ children }: { children: React.ReactNode }) => (
    <div className='mt-auto flex w-full flex-wrap gap-3'>{children}</div>
);

const getLiquidationRisk = (ratio?: Decimal) => {
    if (!ratio)
        return {
            text: 'Low',
            containerStyle: 'bg-success-50 border border-success-100',
            textStyle: 'text-success-700 text-sm font-medium',
            dotStyle: 'bg-success-500',
        };
    const ratioPercent = ratio.mul(100);
    if (ratioPercent.gte(200))
        return {
            text: 'Very Low',
            containerStyle: 'bg-success-50 border border-success-100',
            textStyle: 'text-success-700 text-sm font-medium',
            dotStyle: 'bg-success-500',
        };
    if (ratioPercent.gte(150))
        return {
            text: 'Low',
            containerStyle: 'bg-success-50 border border-success-100',
            textStyle: 'text-success-700 text-sm font-medium',
            dotStyle: 'bg-success-500',
        };
    if (ratioPercent.gte(120))
        return {
            text: 'Medium',
            containerStyle: 'bg-[#FFF7E0] border border-[#FFE4A3]',
            textStyle: 'text-warning-700 text-sm font-medium',
            dotStyle: 'bg-warning-500',
        };
    return {
        text: 'High',
        containerStyle: 'bg-[#FFE4E1] border border-[#FFACA3]',
        textStyle: 'text-error-700 text-sm font-medium',
        dotStyle: 'bg-error-500',
    };
};

export const Positions = ({
    debtTokenInStabilityPool,
    trove,
    price,
    originalDeposit,
    claimGainsButton,
}: PositionsProps) => {
    const { sfStablecoin } = useSfStablecoin();
    const myTransactionState = useMyTransactionState('stability-claim-gains');

    const [sendClaimTransaction] = useTransactionFunction(
        myTransactionState.type,
        sfStablecoin.send.withdrawGainsFromStabilityPool.bind(sfStablecoin.send)
    );

    const collateralRatio =
        !trove.collateral.isZero && !trove.netDebt.isZero
            ? trove.collateralRatio(price)
            : undefined;

    const liquidationRisk = getLiquidationRisk(collateralRatio);

    const liquidationGains = originalDeposit.collateralGain.prettify(2);
    const liquidationGainsUSD = originalDeposit.collateralGain.mul(price);
    const originalPoolShare = originalDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );

    const hasTrove = !trove.isEmpty;
    const hasStabilityDeposit = !originalDeposit.currentDebtToken.isZero;

    const isClaimDisabled =
        originalDeposit.collateralGain.isZero ||
        myTransactionState.type === 'waitingForApproval' ||
        myTransactionState.type === 'waitingForConfirmation';

    const getClaimButtonText = () => {
        if (myTransactionState.type === 'waitingForApproval')
            return 'Waiting for Approval...';
        if (myTransactionState.type === 'waitingForConfirmation')
            return 'Processing...';
        return 'Claim Gains';
    };

    return (
        <div className='mx-auto w-full max-w-[920px]'>
            <h2 className='mb-3 text-left font-primary text-5 font-semibold text-neutral-900'>
                My Positions
            </h2>
            <div className='grid grid-cols-1 items-stretch gap-6 tablet:grid-cols-2'>
                {hasTrove ? (
                    <Card className='flex h-full flex-col'>
                        <div className='grid flex-1 grid-rows-5 gap-6'>
                            <CardHeader
                                icon={
                                    <Vault
                                        size={20}
                                        className='text-primary-500'
                                    />
                                }
                                title='Trove'
                                className='row-span-1'
                                tooltip={{
                                    title: 'Trove',
                                    description: `A personal vault where you deposit ${CURRENCY} as collateral to borrow USDFC. It must maintain a minimum collateral ratio of 110% to avoid liquidation.`,
                                    onButtonClick: () =>
                                        openDocumentation('troveSystem'),
                                }}
                            />

                            <InfoBlock
                                label='Total Debt'
                                value={trove.debt.prettify()}
                                icon={
                                    <>
                                        <USDFCIcon />
                                        <span className='font-primary text-4  font-normal text-neutral-900'>
                                            USDFC
                                        </span>
                                    </>
                                }
                                className='row-span-1 flex-col gap-3'
                            />

                            <StatRow
                                label='Collateral'
                                value={trove.collateral.prettify()}
                                icon={
                                    <>
                                        <FILIcon />
                                        <span className='font-primary text-4  font-normal text-neutral-900'>
                                            {CURRENCY}
                                        </span>
                                    </>
                                }
                                className='row-span-1'
                            />

                            <StatRow
                                label='Collateral Ratio'
                                value={
                                    collateralRatio
                                        ? `${collateralRatio
                                              .mul(100)
                                              .prettify(1)}%`
                                        : '150%'
                                }
                                className='row-span-1'
                            />

                            <StatRow
                                label='Liquidation Risk'
                                value={<RiskBadge {...liquidationRisk} />}
                                className='row-span-1'
                            />
                        </div>

                        <Button
                            href='trove'
                            size={ButtonSizes.md}
                            variant={ButtonVariants.tertiary}
                            className='w-full border-neutral-9 font-semibold'
                            external={false}
                        >
                            Manage Trove
                        </Button>
                    </Card>
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
                    <Card className='flex h-full flex-col'>
                        <div className='grid flex-1 grid-rows-5 gap-6'>
                            <CardHeader
                                icon={
                                    <Layers2
                                        size={20}
                                        className='text-primary-500'
                                    />
                                }
                                title='Stability Pool'
                                className='row-span-1'
                                tooltip={{
                                    title: 'Pool Share',
                                    description:
                                        'Your percentage of the Stability Pool, determining your share of liquidated collateral and rewards.',
                                    onButtonClick: () =>
                                        openDocumentation('stabilityPool'),
                                }}
                            />

                            <InfoBlock
                                label='Liquidation Gain'
                                value={liquidationGains}
                                icon={
                                    <>
                                        <FILIcon className='h-6 w-6' />
                                        <span className='flex gap-3 font-primary text-4 font-normal text-neutral-900'>
                                            {CURRENCY} $
                                            {liquidationGainsUSD.prettify()}
                                        </span>
                                    </>
                                }
                                className='row-span-1'
                            />

                            <StatRow
                                label='Deposit'
                                value={originalDeposit.currentDebtToken.prettify()}
                                icon={
                                    <>
                                        <USDFCIcon />
                                        <span className='font-primary text-4 font-normal text-neutral-900'>
                                            USDFC
                                        </span>
                                    </>
                                }
                                className='row-span-1'
                            />

                            <StatRow
                                label='Pool Share'
                                value={`${originalPoolShare.prettify()}%`}
                                className='row-span-1'
                            />

                            <div className='row-span-1 hidden tablet:block' />
                        </div>
                        <ActionRow>
                            <Button
                                href='/stability-pool'
                                size={ButtonSizes.md}
                                variant={ButtonVariants.tertiary}
                                className='flex-1 border-neutral-9 font-semibold'
                                external={false}
                            >
                                Manage Deposit
                            </Button>
                            {claimGainsButton || (
                                <Button
                                    size={ButtonSizes.md}
                                    variant={ButtonVariants.primary}
                                    className='flex-1 font-semibold'
                                    onClick={sendClaimTransaction}
                                    disabled={isClaimDisabled}
                                >
                                    {getClaimButtonText()}
                                </Button>
                            )}
                        </ActionRow>
                    </Card>
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
