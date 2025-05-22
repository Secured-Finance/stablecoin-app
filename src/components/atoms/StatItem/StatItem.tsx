import { ArrowUpRight } from 'lucide-react';
import { ProtocolStat } from '../../molecules/ProtocolStats/ProtocolStats';

interface StatItemProps {
    stat: ProtocolStat;
    isLast?: boolean;
}

export function StatItem({ stat }: StatItemProps) {
    return (
        <div className={`px-6 py-4`}>
            <h3 className='mb-1 text-sm text-[#565656]'>{stat.label}</h3>
            <div className='flex items-baseline gap-2'>
                <span className='font-bold'>{stat.value}</span>
                {stat.subValue && (
                    <span className='text-sm text-[#565656]'>
                        {stat.subValue}
                    </span>
                )}
                {stat.link && (
                    <a href={stat.link} className='inline-flex items-center'>
                        <ArrowUpRight className='ml-1 inline-block h-4 w-4' />
                    </a>
                )}
            </div>
        </div>
    );
}
