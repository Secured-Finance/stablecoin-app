import React from 'react';
import { StabilityManageView } from './StabilityManageView';

export const Stability: React.FC = props => {
    return (
        <div className='flex w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-8'>
                <div className='w-full'>
                    <StabilityManageView {...props} />
                </div>
            </main>
        </div>
    );
};
