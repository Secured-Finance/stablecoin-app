import { Button } from '@/components/ui';
import Link from 'next/link';
import { ProtocolConfigMap } from 'satoshi-sdk';
import { CoinDetailsCard } from 'src/components/molecules';
import { Page } from 'src/components/templates';

export const Vaults = () => {
    const protocolConfig = ProtocolConfigMap.BITLAYER_MAINNET;
    const collateralCurrencies = protocolConfig.COLLATERALS;

    return (
        <Page name='vaults'>
            <div className='mx-auto flex h-full flex-col items-center justify-center text-neutral-900 laptop:max-w-[663px] laptop:gap-9'>
                <h1 className='typography-desktop-h-6'>
                    Choose a Vault to mint sfUSD
                </h1>
                <section className='w-full'>
                    <div className='flex items-center justify-between rounded-xl px-5 py-3 text-neutral-700 shadow-lg'>
                        <h2 className='typography-desktop-body-2'>
                            Earn up to <b>3.69% APR on</b> any sfUSD you
                            <br />
                            mint by depositing into the Stability Pool.
                        </h2>
                        <aside className='flex flex-col items-center gap-2'>
                            <Link href='/earn'>
                                <Button className='bg-neutral-800 text-4.5 text-neutral-50'>
                                    Take me there
                                </Button>
                            </Link>
                            <Link href='/' className='text-3 leading-5'>
                                <span className='underline'>
                                    More opportunities
                                </span>
                            </Link>
                        </aside>
                    </div>
                </section>
                <section className='flex w-full flex-row laptop:gap-[22px]'>
                    {collateralCurrencies.map(ccy => (
                        <CoinDetailsCard key={ccy.ADDRESS} currency={ccy} />
                    ))}
                </section>
            </div>
        </Page>
    );
};
