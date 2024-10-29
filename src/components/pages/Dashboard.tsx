import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';

export const Dashboard: React.FC = () => (
    <section className='mx-auto flex w-full flex-col items-start gap-6 pt-5 laptop:flex-row laptop:gap-5 laptop:pt-6'>
        <div className='mx-auto flex w-full flex-col gap-6 laptop:w-[58%]'>
            <Trove />
            <Stability />
        </div>

        <aside className='flex w-full flex-col gap-5 laptop:w-[42%]'>
            <SystemStats />
            <PriceManager />
        </aside>
    </section>
);
