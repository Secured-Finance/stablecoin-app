import { useContext } from 'react';
import { StabilityViewContext, StabilityViewContextType } from 'src/contexts';

export const useStabilityView = (): StabilityViewContextType => {
    const context: StabilityViewContextType | null =
        useContext(StabilityViewContext);

    if (context === null) {
        throw new Error(
            'You must add a <StabilityViewProvider> into the React tree'
        );
    }

    return context;
};
