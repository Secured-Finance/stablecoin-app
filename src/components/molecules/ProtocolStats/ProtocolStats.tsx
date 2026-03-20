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
    const allStats = [...stats.leftColumn, ...stats.rightColumn];

    return (
        <>
            {/* Mobile: Single column with all stats */}
            <div className='tablet:hidden'>
                {allStats.map((stat, index) => (
                    <StatItem key={index} stat={stat} />
                ))}
            </div>

            {/* Tablet+: Two column layout */}
            <div className='hidden justify-center tablet:grid tablet:grid-cols-2'>
                <div>
                    {stats.leftColumn.map((stat, index) => (
                        <StatItem key={index} stat={stat} />
                    ))}
                </div>
                <div>
                    {stats.rightColumn.map((stat, index) => (
                        <StatItem key={index} stat={stat} />
                    ))}
                </div>
            </div>
        </>
    );
}
