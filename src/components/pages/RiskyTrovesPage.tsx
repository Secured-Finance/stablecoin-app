import React from 'react';
import { LiquidationManager } from 'src/components/LiquidationManager';
import { RiskyTroves } from 'src/components/RiskyTroves';
import { SystemStats } from 'src/components/SystemStats';
import { CardComponent } from 'src/components/templates';

export const RiskyTrovesPage: React.FC = () => (
    <section className='w-full'>
        <div className='mx-auto flex w-full flex-col items-start gap-6 pt-5 laptop:flex-row laptop:gap-5 laptop:pt-6'>
            <div className='mx-auto flex w-full flex-col gap-6 laptop:w-[58%]'>
                <CardComponent title='Bot functionality'>
                    <div className='typography-desktop-body-4'>
                        <p>
                            Liquidation is expected to be carried out by bots.
                        </p>
                        <p>
                            Early on you may be able to manually liquidate
                            Troves, but as the system matures this will become
                            less likely.
                        </p>
                    </div>
                </CardComponent>
                <LiquidationManager />
            </div>

            <aside className='hidden w-full flex-col gap-5 laptop:flex laptop:w-[42%]'>
                <SystemStats />
            </aside>
        </div>
        <div className='w-full pt-6'>
            <RiskyTroves pageSize={10} />
        </div>
    </section>
);
