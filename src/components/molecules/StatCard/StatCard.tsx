import { Info } from 'lucide-react';
import React from 'react';
import { CustomTooltip } from 'src/components/atoms';

interface StatCardProps {
    title: string;
    description: string;
    value: React.ReactNode;
    tooltip?: {
        title: string;
        description: string;
        onButtonClick?: () => void;
    };
}

export const StatCard = ({
    title,
    description,
    value,
    tooltip,
}: StatCardProps) => {
    return (
        <div className='rounded-xl border border-neutral-9 bg-white p-6'>
            <div className='flex items-start justify-between'>
                <div>
                    <div className='mb-1 flex items-center gap-2'>
                        <h3 className='text-left text-sm font-bold text-neutral-450'>
                            {title}
                        </h3>
                        {tooltip && (
                            <CustomTooltip
                                title={tooltip.title}
                                description={tooltip.description}
                                onButtonClick={tooltip.onButtonClick}
                                position='top'
                            >
                                <Info className='h-5 w-5 cursor-pointer text-neutral-400 hover:text-blue-500' />
                            </CustomTooltip>
                        )}
                    </div>
                    <div className='text-sm text-neutral-450 tablet:max-w-[60%]'>
                        {description}
                    </div>
                </div>
                <div>{value}</div>
            </div>
        </div>
    );
};
