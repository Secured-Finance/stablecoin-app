import clsx from 'clsx';
import React from 'react';
import { Card } from 'src/components/atoms';

export type PositionInfoCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title?: string;
    children?: React.ReactNode;
    verticalHeader?: boolean;
    isEmpty?: boolean;
};

export const PositionInfoCard = ({
    icon: Icon,
    title,
    children,
    verticalHeader = false,
    isEmpty = false,
}: PositionInfoCardProps) => {
    const headerClass = clsx(
        'mb-6 flex',
        verticalHeader ? 'flex-col gap-3' : 'items-center gap-2'
    );
    return (
        <Card className='flex max-w-none flex-col justify-between p-6'>
            <div className={headerClass}>
                <div
                    className={clsx(
                        'flex items-center justify-center',
                        isEmpty
                            ? 'h-20 w-20 rounded-full border-[1.54px] border-neutral-200 bg-neutral-100'
                            : 'h-10 w-10 rounded-[9.23px] border-[0.77px] border-transparent bg-tertiary-50'
                    )}
                >
                    <Icon
                        className={clsx(
                            isEmpty
                                ? 'h-10 w-10 text-neutral-400'
                                : 'h-6 w-6 text-primary-500'
                        )}
                    />
                </div>
                <h3 className='text-xl font-semibold text-neutral-900'>
                    {title}
                </h3>
            </div>
            {children}
        </Card>
    );
};
