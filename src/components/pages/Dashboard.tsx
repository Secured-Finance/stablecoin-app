import Link from 'next/link';
import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';
import { Alert } from 'src/components/atoms';
import { COIN } from 'src/strings';
import { getFixedIncomeMarketLink } from 'src/utils';
import { useAccount } from 'wagmi';

export const Dashboard: React.FC = () => {
    const { isConnected } = useAccount();
    return (
        <section className='w-full'>
            <section className='mx-auto w-full pt-5 laptop:pt-6'>
                {!isConnected ? (
                    <Alert color='info'>
                        Connect Wallet to start using {COIN}.
                    </Alert>
                ) : (
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
