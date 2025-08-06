import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'src/components/atoms';
import {
    FeatureCardsOrPositions,
    ProtocolOverview,
} from 'src/components/organisms';
import { init, reduce } from 'src/components/Stability/StabilityDepositManager';
import {
    useAddToken,
    useSfStablecoin,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { COIN } from 'src/strings';
import { getFixedIncomeMarketLink } from 'src/utils';
import { useAccount } from 'wagmi';

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

    const { isConnected, address } = useAccount();
    const [isTokenAdded, setIsTokenAdded] = useState<boolean | null>(null);

    const { addToken } = useAddToken({
        debtToken: addresses.debtToken,
    });

    const checkIfTokenAdded = useCallback(() => {
        if (!addresses.debtToken) return false;
        return Boolean(localStorage.getItem(`token_${addresses.debtToken}`));
    }, [addresses.debtToken]);

    const dismissTokenBanner = () => {
        if (addresses.debtToken) {
            localStorage.setItem(`token_${addresses.debtToken}`, 'true');
        }
        setIsTokenAdded(true);
    };

    const handleAddToken = async () => {
        const success = await addToken();
        if (success) dismissTokenBanner();
    };

    useEffect(() => {
        if (!isConnected || !address || !addresses.debtToken) return;

        const tokenAdded = checkIfTokenAdded();
        setIsTokenAdded(tokenAdded);
    }, [isConnected, address, addresses.debtToken, checkIfTokenAdded]);
    return (
        <div className='flex w-full flex-col gap-2 px-4 pt-5 laptop:pt-3'>
            <div className='w-full'>
                {!isConnected ? (
                    <div className='flex flex-col gap-2 p-4'>
                        <Alert color='info'>
                            Connect Wallet to start using {COIN}.
                        </Alert>
                    </div>
                ) : (
                    <div className='flex flex-col gap-2 p-4'>
                        {isTokenAdded ? (
                            <Alert color='info'>
                                Use {COIN} to earn stable yield in the{' '}
                                <Link
                                    className='font-semibold text-primary-500'
                                    href={getFixedIncomeMarketLink()}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    aria-label='Fixed Income'
                                >
                                    Fixed Income market
                                </Link>
                                .
                            </Alert>
                        ) : (
                            <div className='relative flex flex-col gap-2'>
                                <Alert color='info'>
                                    Add {COIN} to Wallet,&nbsp;
                                    <button
                                        className='font-semibold text-primary-500'
                                        onClick={handleAddToken}
                                    >
                                        Click here
                                    </button>
                                    <button
                                        className='absolute right-2 top-2 mt-1 flex h-4 w-4 items-center justify-center text-gray-500 hover:text-gray-700'
                                        onClick={dismissTokenBanner}
                                        aria-label='Dismiss'
                                    >
                                        <X className='h-4 w-4' />
                                    </button>
                                </Alert>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className='flex w-full flex-col gap-16 px-4 py-4'>
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
        </div>
    );
};
