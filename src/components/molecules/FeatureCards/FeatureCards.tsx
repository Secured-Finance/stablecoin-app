import type React from 'react';
import { cn } from 'src/utils';
import { BorrowIcon, BridgeIcon, EarnIcon } from './ProtocolIcons';
import { Card } from 'src/components/atoms';
import { CURRENCY } from 'src/strings';
import { Link } from 'react-router-dom';

type FeatureCardProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    href: string;
};

const FeatureCard = ({
    title,
    description,
    icon,
    className,
    titleClassName,
    descriptionClassName,
    href,
}: FeatureCardProps) => {
    return (
        <Link
            to={href}
            className='block w-full max-w-none laptop:max-w-[290px]'
        >
            <Card
                className={cn(
                    'w-full max-w-none transition-colors duration-300 laptop:max-w-[290px]',
                    className
                )}
            >
                <div className='mb-6 flex items-center'>{icon}</div>
                <h3
                    className={cn('mb-2 text-xl font-semibold', titleClassName)}
                >
                    {title}
                </h3>
                <p className={cn('text-sm', descriptionClassName)}>
                    {description}
                </p>
            </Card>
        </Link>
    );
};

export function FeatureCards() {
    return (
        <div className='grid grid-cols-1 justify-items-center gap-6 laptop:grid-cols-3'>
            <FeatureCard
                title='Borrow USDFC'
                description={`Create a Trove to deposit ${CURRENCY} as collateral and borrow USDFC.`}
                icon={<BorrowIcon />}
                className='bg-primary-500 text-white hover:bg-secondary-500'
                descriptionClassName='opacity-90'
                href='/trove'
            />
            <FeatureCard
                title={`Earn ${CURRENCY}`}
                description={`Deposit USDFC into the Stability Pool to earn ${CURRENCY} rewards.`}
                icon={<EarnIcon />}
                className='bg-[#FFCE45] hover:bg-[#E9B830]'
                titleClassName='text-[#332500]'
                descriptionClassName='text-[#332500]'
                href='/stability-pool'
            />
            <FeatureCard
                title='Bridge Assets'
                description='Seamlessly transfer assets to and from the Filecoin network.'
                icon={<BridgeIcon />}
                className='bg-[#E3E3E3] hover:bg-[#D7D7D7]'
                titleClassName='text-[#252525]'
                descriptionClassName='text-[#252525]'
                href='/bridge'
            />
        </div>
    );
}
