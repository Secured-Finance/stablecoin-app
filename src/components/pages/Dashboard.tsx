import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';
import { Alert } from 'src/components/atoms';
import { COIN } from 'src/strings';
import { getFixedIncomeMarketLink } from 'src/utils';
import { useAccount, useWalletClient } from 'wagmi';
import { useSfStablecoin } from 'src/hooks';

export const Dashboard: React.FC = () => {
    const { isConnected, address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isTokenAdded, setIsTokenAdded] = useState<boolean | null>(null);
    const {
        sfStablecoin: {
            connection: { addresses },
        },
    } = useSfStablecoin();

    const checkToken = useCallback(() => {
        if (!addresses.debtToken) return false;
        return !!localStorage.getItem(`token_${addresses.debtToken}`);
    }, [addresses.debtToken]);

    const addToken = useCallback(async () => {
        if (!walletClient || !address || !addresses.debtToken) return;
        try {
            const success = await walletClient.watchAsset({
                type: 'ERC20',
                options: {
                    address: addresses.debtToken,
                    symbol: COIN,
                    decimals: 18,
                    image: 'https://app.usdfc.net/apple-touch-icon.png',
                },
            });
            if (success) {
                localStorage.setItem(`token_${addresses.debtToken}`, 'true');
                setIsTokenAdded(true);
            }
        } catch {}
    }, [walletClient, address, addresses.debtToken]);

    useEffect(() => {
        if (isConnected && address && addresses.debtToken) {
            setIsTokenAdded(checkToken());
        }
    }, [isConnected, address, addresses.debtToken, checkToken]);

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
                            <Alert color='info'>
                                Add {COIN} to the Wallet{' '}
                                <button
                                    className='font-semibold text-primary-500'
                                    onClick={addToken}
                                >
                                    Click here
                                </button>
                            </Alert>
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
