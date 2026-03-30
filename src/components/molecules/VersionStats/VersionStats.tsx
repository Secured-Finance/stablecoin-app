import { StatItem } from 'src/components/atoms';
import { ProtocolStat } from 'src/components/molecules';
interface ProtocolStatsProps {
    stats: {
        versionStats: ProtocolStat[];
    };
}

export function VersionStats({ stats }: ProtocolStatsProps) {
    return (
        <div className='grid grid-cols-1 laptop:grid-cols-2'>
            {stats.versionStats.map((stat, index) => (
                <StatItem key={index} stat={stat} />
            ))}
        </div>
    );
}
