import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Card } from 'src/components/atoms';

type StatItem = {
    label: string;
    value: React.ReactNode;
};

type PositionInfoCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    mainStat?: {
        label: string;
        value: React.ReactNode;
    };
    stats?: StatItem[];
    riskLevel?: string;
    actions?: React.ReactNode;
    to?: string;
    buttonText?: string;
    buttonVariant?: 'primary' | 'ghost';
};

export const PositionInfoCard = ({
    icon: Icon,
    title,
    description,
    mainStat,
    stats,
    riskLevel,
    actions,
    to,
    buttonText,
    buttonVariant,
}: PositionInfoCardProps) => {
    return (
        <Card className='flex flex-col justify-between gap-1 p-6'>
            <div>
                {/* Header */}
                <div className='mb-6 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-50'>
                        <Icon className='h-6 w-6 text-primary-500' />
                    </div>
                    <h3 className='text-xl font-semibold text-neutral-900'>
                        {title}
                    </h3>
                </div>

                {/* Optional description (used in Empty state cards) */}
                {description && (
                    <p className='mb-6 text-sm text-secondary-400'>
                        {description}
                    </p>
                )}

                {/* Optional mainStat (e.g., Total Debt / Liquidation Gain) */}
                {mainStat && (
                    <div className='mb-6'>
                        <p className='text-sm text-neutral-600'>
                            {mainStat.label}
                        </p>
                        <div className='text-2xl flex items-center gap-1 font-semibold text-neutral-900'>
                            {mainStat.value}
                        </div>
                    </div>
                )}

                {/* Stats section */}
                {(stats || riskLevel) && (
                    <div className='space-y-3 text-sm text-neutral-700'>
                        {stats?.map((item, index) => (
                            <div key={index} className='flex justify-between'>
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                        ))}

                        {riskLevel && (
                            <div className='flex justify-between'>
                                <span>Liquidation Risk</span>
                                <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                                    {riskLevel}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Primary action (fallback) */}
            {to && buttonText && !actions && (
                <Link
                    to={to}
                    data-testid='button-link'
                    className={clsx(
                        'mt-6 block w-full rounded-lg py-2 text-center text-sm font-medium',
                        buttonVariant === 'ghost'
                            ? 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50'
                            : 'hover:bg-primary-600 bg-primary-500 text-white'
                    )}
                >
                    {buttonText}
                </Link>
            )}

            {/* Custom CTA block */}
            {actions && <div className='mt-6 flex gap-3'>{actions}</div>}
        </Card>
    );
};
