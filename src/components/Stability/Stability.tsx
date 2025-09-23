import React from 'react';
import { StabilityManageView } from './StabilityManageView';

export const Stability: React.FC = props => {
    return (
        <div className='flex w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-16'>
                <div className='mx-auto w-full max-w-3xl'>
                    <StabilityManageView {...props} />
                </div>
            </main>
        </div>
    );
};
