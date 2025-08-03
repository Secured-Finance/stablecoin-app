import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import {
    FeatureCardsOrPositions,
    ProtocolOverview,
} from 'src/components/organisms';
import {
    useSfStablecoin,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { useAccount } from 'wagmi';
import { init, reduce } from '../Stability/StabilityDepositManager';

const select = ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedProtocolToken,
    frontend,
    trove,
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
    trove,
});

export const Dashboard: React.FC = () => {
    const data = useSfStablecoinSelector(select);
    const {
        sfStablecoin: {
            connection: { deploymentDate, addresses, chainId },
        },
    } = useSfStablecoin();
    const contextData = { deploymentDate, addresses, chainId };

    const [{ originalDeposit }] = useSfStablecoinReducer(reduce, init);

    const { isConnected } = useAccount();
    return (
        <div className='mt-[25px] flex w-full flex-col gap-16 px-4 py-8'>
            <FeatureCardsOrPositions
                data={{
                    isConnected,
                    debtTokenInStabilityPool: data.debtTokenInStabilityPool,
                    trove: data.trove,
                    price: data.price,
                    originalDeposit,
                }}
            />
            <ProtocolOverview data={data} contextData={contextData} />
        </div>
    );
};
