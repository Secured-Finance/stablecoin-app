import React from 'react';
import { useStabilityView } from './context/StabilityViewContext';
import { StabilityDepositView } from './StabilityDepositView';
import { StabilityManageView } from './StabilityManageView';

export const Stability: React.FC = props => {
    const { view } = useStabilityView();

    return (
        <div className='flex w-full flex-col'>
            <main className='flex flex-grow flex-col items-center justify-center px-4 py-16'>
                <div className='mx-auto w-full max-w-3xl'>
                    {(() => {
                        switch (view) {
                            case 'NONE':
                            case 'DEPOSITING':
                                return <StabilityDepositView {...props} />;
                            case 'ADJUSTING':
                            case 'ACTIVE':
                                return <StabilityManageView {...props} />;
                        }
                    })()}
                </div>
            </main>
        </div>
    );
};
