import { FeatureCardsOrPositions } from '../FeatureCardOrPosition';
import { ProtocolOverview } from '../molecules/ProtocolOverview/ProtocolOverview';

export const Dashboard: React.FC = () => {
    return (
        <div className='mt-[25px] flex w-full flex-col gap-16 px-4 py-8'>
            <FeatureCardsOrPositions />
            <ProtocolOverview />
        </div>
    );
};
