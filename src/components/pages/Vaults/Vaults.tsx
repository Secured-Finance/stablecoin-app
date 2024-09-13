import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { CoinDetailsCard } from 'src/components/molecules';
import { Page } from 'src/components/templates';
import { Button } from 'src/components/ui';
import { mockUseSF } from 'src/stories/mocks/useSFMock';

export const Vaults = () => {
    const securedFinance = mockUseSF();
    const collateralCurrencies = securedFinance.protocolConfig.COLLATERALS;

    return (
        <Page name='vaults'>
            <div className='mx-auto flex h-full flex-col items-center justify-center text-neutral-900 laptop:max-w-[664px] laptop:gap-[34px]'>
                <h1 className='typography-desktop-h-6'>
                    Choose a Vault to mint sfUSD
                </h1>
                <section className='w-full'>
                    <div className='flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-6 pb-[11.5px] pt-[12.5px] text-neutral-700 shadow-lg'>
                        <h2 className='typography-desktop-body-2'>
                            Earn up to <b>3.69% APR</b> on any sfUSD you
                            <br />
                            mint by depositing into the Stability Pool.
                        </h2>
                        <aside className='flex flex-col items-center gap-1'>
                            <Link href='/earn'>
                                <Button className='w-[220px] bg-neutral-800 font-semibold text-neutral-50'>
                                    Take me there
                                </Button>
                            </Link>
                            <Link
                                href='/'
                                className='flex items-center gap-1 text-3 leading-5'
                            >
                                <span className='underline'>
                                    More opportunities
                                </span>
                                <ArrowRightIcon className='h-3 w-3' />
                            </Link>
                        </aside>
                    </div>
                </section>
                <section className='mt-3 flex w-full flex-row laptop:gap-[22px]'>
                    {collateralCurrencies.map(ccy => (
                        <CoinDetailsCard key={ccy.NAME} currency={ccy} />
                    ))}
                </section>
            </div>
        </Page>
    );
};
