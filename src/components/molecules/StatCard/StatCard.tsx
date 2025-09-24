import React from 'react';

interface StatCardProps {
    title: string;
    description: string;
    value: React.ReactNode;
}

export const StatCard = ({ title, description, value }: StatCardProps) => {
    return (
        <div className='rounded-xl border border-neutral-9 bg-white p-6'>
            <div className='flex items-start justify-between'>
                <div>
                    <h3 className='mb-1 text-left text-sm font-bold text-neutral-450'>
                        {title}
                    </h3>
                    <div className='text-sm text-neutral-450 tablet:max-w-[60%]'>
                        {description}
                    </div>
                </div>
                <div>{value}</div>
            </div>
        </div>
    );
};
