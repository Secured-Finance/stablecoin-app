import { ProtocolStat } from '../ProtocolStat';
import { StatItem } from '../StatItem';

interface ProtocolStatsProps {
    stats: {
        leftColumn: ProtocolStat[];
        rightColumn: ProtocolStat[];
        cfleft: ProtocolStat[];
        cfright: ProtocolStat[];
    };
}

export function VersionStats({ stats }: ProtocolStatsProps) {
    return (
        <div className='grid grid-cols-2 tablet:grid-cols-2'>
            <div>
                {stats.cfleft.map((stat, index) => (
                    <StatItem
                        key={index}
                        stat={stat}
                        isLast={index === stats.leftColumn.length - 1}
                    />
                ))}
            </div>
            <div>
                {stats.cfright.map((stat, index) => (
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
