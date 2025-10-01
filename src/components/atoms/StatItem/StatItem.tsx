import { ArrowUpRight } from 'lucide-react';
import { ProtocolStat } from 'src/components/molecules';

interface StatItemProps {
    stat: ProtocolStat;
}

export const StatItem = ({ stat }: StatItemProps) => {
    return (
        <div className='flex flex-col gap-2 px-6 py-4'>
            <h3 className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                {stat.label}
            </h3>
            <div className='flex items-center gap-1'>
                {stat.link ? (
                    <a
                        href={stat.link}
                        className='flex items-center gap-1'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <span className='font-primary text-4 font-semibold leading-[19px] text-neutral-900'>
                            {stat.value}
                        </span>
                        <ArrowUpRight
                            data-testid='link-arrow'
                            className='h-4 w-4 text-neutral-900'
                        />
                    </a>
                ) : (
                    <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                        {stat.value}
                    </span>
                )}
                {stat.subValue && (
                    <span className='font-primary text-sm font-normal leading-[17px] text-neutral-450'>
                        {stat.subValue}
                    </span>
                )}
            </div>
        </div>
    );
};
