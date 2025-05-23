import React from 'react';
import { ActiveDeposit } from './ActiveDeposit';
import { NoDeposit } from './NoDeposit';
import { StabilityDepositManager } from './StabilityDepositManager';
import { useStabilityView } from './context/StabilityViewContext';

export const Stability: React.FC = props => {
    const { view } = useStabilityView();

    switch (view) {
        case 'NONE': {
            return <NoDeposit {...props} />;
        }
        case 'DEPOSITING': {
            return <StabilityDepositManager {...props} />;
        }
        case 'ADJUSTING': {
            return <StabilityDepositManager {...props} />;
        }
        case 'ACTIVE': {
            return <ActiveDeposit {...props} />;
        }
    }
};
