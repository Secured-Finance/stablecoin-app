import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { FeatureCardsOrPositions } from '../FeatureCardOrPosition';
import { ProtocolOverview } from '../organisms';

const select = ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedProtocolToken,
    frontend,
}: SfStablecoinStoreState) => ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedProtocolToken,
    kickbackRate:
        frontend.status === 'registered' ? frontend.kickbackRate : null,
});

export const Dashboard: React.FC = () => {
    const data = useSfStablecoinSelector(select);
    const {
        sfStablecoin: {
            connection: { deploymentDate, addresses, chainId },
        },
    } = useSfStablecoin();
    const contextData = { deploymentDate, addresses, chainId };
    return (
        <div className='mt-[25px] flex w-full flex-col gap-16 px-4 py-8'>
            <FeatureCardsOrPositions />
            <ProtocolOverview data={data} contextData={contextData} />
        </div>
    );
};
