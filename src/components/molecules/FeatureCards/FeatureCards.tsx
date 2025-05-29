import type React from 'react';
import { cn } from 'src/utils';
import {
    BorrowIcon,
    BridgeIcon,
    EarnIcon,
} from '../../atoms/ProtocolIcons/ProtocolIcons';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}

const FeatureCard = ({
    title,
    description,
    icon,
    className,
    titleClassName,
    descriptionClassName,
}: FeatureCardProps) => {
    return (
        <div className={cn('w-full max-w-[290px] rounded-xl p-6', className)}>
            <div className='mb-6 flex items-center'>{icon}</div>
            <h3 className={cn('text-xl mb-2 font-bold', titleClassName)}>
                {title}
            </h3>
            <p className={cn('text-sm', descriptionClassName)}>{description}</p>
        </div>
    );
};
export function FeatureCards() {
    return (
        <div className='grid grid-cols-1 justify-items-center gap-6 laptop:grid-cols-3'>
            <FeatureCard
                title='Borrow USDFC'
                description='Create a Trove to deposit FIL as collateral and borrow USDFC.'
                icon={<BorrowIcon />}
                className='bg-primary-500 text-white'
                descriptionClassName='opacity-90'
            />
            <FeatureCard
                title='Earn FIL'
                description='Deposit USDFC into the Stability Pool to earn FIL rewards.'
                icon={<EarnIcon />}
                className='bg-warning-200'
                titleClassName='text-[#332500]'
                descriptionClassName='text-[#332500]'
            />
            <FeatureCard
                title='Bridge Assets'
                description='Seamlessly transfer assets to and from the Filecoin network.'
                icon={<BridgeIcon />}
                className='bg-neutral-9'
                titleClassName='text-[#252525]'
                descriptionClassName='text-secondary-400'
            />
        </div>
    );
}
