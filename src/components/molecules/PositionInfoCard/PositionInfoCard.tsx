import clsx from 'clsx';
import React from 'react';
import { Card } from 'src/components/atoms';

export type PositionInfoCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children?: React.ReactNode;
    verticalHeader?: boolean;
};

export const PositionInfoCard = ({
    icon: Icon,
    title,
    children,
    verticalHeader = false,
}: PositionInfoCardProps) => {
    const headerClass = clsx(
        'mb-6 flex',
        verticalHeader ? 'flex-col gap-3' : 'items-center gap-2'
    );
    return (
        <Card className='flex flex-col justify-between p-6'>
            <div className={headerClass}>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-50'>
                    <Icon className='h-6 w-6 text-primary-500' />
                </div>
                <h3 className='text-xl font-semibold text-neutral-900'>
                    {title}
                </h3>
            </div>
            {children}
        </Card>
    );
};
