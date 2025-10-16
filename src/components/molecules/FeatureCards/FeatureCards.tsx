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
            className='block w-full max-w-none laptop:h-[204px] laptop:max-w-[290.67px]'
        >
            <Card
                className={cn(
                    'flex h-full w-full max-w-none flex-col items-start gap-6 rounded-xl p-6 transition-colors duration-300 laptop:h-[204px] laptop:max-w-[290.67px] laptop:rounded-[20px] laptop:p-6',
                    className
                )}
            >
                {/* Illustration Container */}
                <div className='flex h-[60px] w-full items-center self-stretch'>
                    {icon}
                </div>

                {/* Text Container */}
                <div className='flex w-full flex-col items-start gap-3 self-stretch'>
                    <h3
                        className={cn(
                            'w-full self-stretch font-primary text-5 font-semibold leading-[100%]',
                            titleClassName
                        )}
                    >
                        {title}
                    </h3>
                    <p
                        className={cn(
                            'w-full self-stretch font-primary text-sm font-medium leading-[130%]',
                            descriptionClassName
                        )}
                    >
                        {description}
                    </p>
                </div>
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
                className='bg-borrowBg text-white hover:bg-borrowHover hover:shadow-[0px_4px_10px_rgba(26,48,255,0.2)]'
                descriptionClassName='opacity-90'
                href='/trove'
            />
            <FeatureCard
                title={`Earn ${CURRENCY}`}
                description={`Deposit USDFC into the Stability Pool to earn ${CURRENCY} rewards.`}
                icon={<EarnIcon />}
                className='bg-earnBg text-earnText hover:bg-earnHover hover:shadow-[0px_4px_10px_rgba(233,184,48,0.2)]'
                descriptionClassName='opacity-90'
                href='/stability-pool'
            />
            <FeatureCard
                title='Bridge Assets'
                description='Seamlessly transfer assets to and from the Filecoin network.'
                icon={<BridgeIcon />}
                className='bg-bridgeBg text-bridgeText hover:bg-bridgeHover hover:shadow-[0px_4px_10px_rgba(208,207,207,0.15)]'
                descriptionClassName='opacity-90'
                href='/bridge'
            />
        </div>
    );
}
