import React from 'react';
import { LiquidationManager } from 'src/components/LiquidationManager';
import { RiskyTroves } from 'src/components/RiskyTroves';
import { SystemStats } from 'src/components/SystemStats';
import { PlainCard } from 'src/components/templates';

export const RiskyTrovesPage: React.FC = () => (
    <section className='w-full'>
        <div className='mx-auto flex w-full flex-col items-start gap-6 pt-5 laptop:flex-row laptop:gap-5 laptop:pt-6'>
            <div className='mx-auto flex w-full flex-col gap-6 laptop:w-[58%]'>
                <PlainCard title='Bot functionality'>
                    <div className='typography-desktop-body-5'>
                        <p>
                            Liquidation is expected to be carried out by bots.
                        </p>
                        <p>
                            Early on you may be able to manually liquidate
                            Troves, but as the system matures this will become
                            less likely.
                        </p>
                    </div>
                </PlainCard>
                <LiquidationManager />
            </div>

            <aside className='hidden w-full flex-col gap-5 laptop:flex laptop:w-[42%]'>
                <SystemStats />
            </aside>
        </div>
        <div className='w-full'>
            <RiskyTroves pageSize={10} />
        </div>
    </section>
);
