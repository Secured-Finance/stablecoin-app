import { FeatureCardsOrPositions, ProtocolOverview } from '../molecules';

export const Dashboard: React.FC = () => {
    return (
        <div className='mt-[25px] flex flex-col gap-16 px-4 py-8'>
            <FeatureCardsOrPositions />
            <ProtocolOverview />
        </div>
    );
};
