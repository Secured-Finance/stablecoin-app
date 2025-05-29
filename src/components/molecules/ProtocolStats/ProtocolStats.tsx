import { StatItem } from 'src/components/atoms';

export interface ProtocolStat {
    label: string;
    value: string;
    subValue?: string;
    link?: string;
}

interface ProtocolStatsProps {
    stats: {
        leftColumn: ProtocolStat[];
        rightColumn: ProtocolStat[];
    };
}

export function ProtocolStats({ stats }: ProtocolStatsProps) {
    return (
        <div className='grid grid-cols-2 justify-center'>
            <div>
                {stats.leftColumn.map((stat, index) => (
                    <StatItem
                        key={index}
                        stat={stat}
                        isLast={index === stats.leftColumn.length - 1}
                    />
                ))}
            </div>
            <div>
                {stats.rightColumn.map((stat, index) => (
                    <StatItem
                        key={index}
                        stat={stat}
                        isLast={index === stats.rightColumn.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
