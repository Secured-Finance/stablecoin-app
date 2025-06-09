import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';
import { Alert } from 'src/components/atoms';
import { COIN } from 'src/strings';
import { getFixedIncomeMarketLink } from 'src/utils';
import { useAccount } from 'wagmi';
import { useAddToken, useSfStablecoin } from 'src/hooks';
import { X } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { isConnected, address } = useAccount();
    const [isTokenAdded, setIsTokenAdded] = useState<boolean | null>(null);

    const {
        sfStablecoin: {
            connection: { addresses },
        },
    } = useSfStablecoin();

    const { addToken } = useAddToken({
        debtToken: addresses.debtToken,
    });

    const checkIfTokenAdded = useCallback(() => {
        if (!addresses.debtToken) return false;
        return Boolean(localStorage.getItem(`token_${addresses.debtToken}`));
    }, [addresses.debtToken]);

    const dismissTokenBanner = () => setIsTokenAdded(true);

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
        <section className='w-full'>
            <section className='mx-auto w-full pt-5 laptop:pt-6'>
                {!isConnected ? (
                    <Alert color='info'>
                        Connect Wallet to start using {COIN}.
                    </Alert>
                ) : (
                    <div className='flex flex-col gap-2'>
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
            </section>

            <section className='mx-auto flex w-full flex-col items-start gap-6 pt-5 laptop:flex-row laptop:gap-5 laptop:pt-6'>
                <div className='mx-auto flex w-full flex-col gap-6 laptop:w-[58%]'>
                    <Trove />
                    <Stability />
                </div>
                <aside className='flex w-full flex-col gap-5 laptop:w-[42%]'>
                    <div className='hidden laptop:block'>
                        <SystemStats />
                    </div>
                    <PriceManager />
                </aside>
            </section>
        </section>
    );
};
