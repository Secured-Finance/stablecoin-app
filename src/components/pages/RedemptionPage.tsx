import Link from 'next/link';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Alert } from 'src/components/atoms';
import { PriceManager } from 'src/components/PriceManager';
import { Redemption } from 'src/components/Redemption/Redemption';
import { SystemStats } from 'src/components/SystemStats';
import { CardComponent } from 'src/components/templates';
import { DOCUMENTATION_LINKS } from 'src/constants';
import { COIN, CURRENCY } from 'src/strings';

export const RedemptionPage: React.FC = () => (
    <section className='w-full'>
        <div className='mx-auto flex w-full flex-col items-start gap-6 pt-5 laptop:flex-row laptop:gap-5 laptop:pt-6'>
            <div className='mx-auto flex w-full flex-col gap-6 laptop:w-[58%]'>
                <CardComponent title='Bot functionality'>
                    <div className='typography-desktop-body-4 flex flex-col gap-3'>
                        <div>
                            <p>
                                Redemptions are expected to be carried out by
                                bots when arbitrage opportunities emerge.
                            </p>
                            <p>
                                Most of the time you will get a better rate for
                                converting {COIN} to {CURRENCY} on other
                                exchanges.
                            </p>
                        </div>
                        <Alert color='warning'>
                            Redemption is not for repaying your loan. To repay
                            your loan, adjust or close your Trove on the{' '}
                            <NavLink className='font-semibold' to='/'>
                                Dashboard
                            </NavLink>
                            . Learn more about redemptions at the{' '}
                            <Link
                                className='font-semibold text-primary-500'
                                href={DOCUMENTATION_LINKS.redemption}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label={`${COIN} Redemption`}
                            >
                                Secured Finance Docs
                            </Link>
                            .
                        </Alert>
                    </div>
                </CardComponent>
                <Redemption />
            </div>

            <aside className='flex w-full flex-col gap-5 laptop:w-[42%]'>
                <div className='hidden laptop:block'>
                    <SystemStats />
                </div>
                <PriceManager />
            </aside>
        </div>
    </section>
);
