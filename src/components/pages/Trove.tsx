import { useEffect, useState } from 'react';
import { useSfStablecoinSelector } from 'src/hooks';
import { Opening } from '../Trove/Opening';
import { Adjusting } from '../Trove/Adjusting';
import { YourTrove } from './YourTrove';

export const TrovePage = () => {
    const [activeTab, setActiveTab] = useState('create');

    const trove = useSfStablecoinSelector(state => state.trove);
    useEffect(() => {
        if (trove) {
            setActiveTab('manage');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    return (
        <div className='min-h-[100vh] w-full'>
            <main className='container mx-auto px-4 py-10'>
                <h1 className='text-3xl mb-8 font-bold'>Your Trove</h1>
                <>
                    {activeTab === 'create' && <Opening />}
                    {trove && <YourTrove />}
                    {activeTab === 'manage' && <Adjusting />}
                </>
            </main>
        </div>
    );
};
