import { useContext } from 'react';
import { LiquityContext } from 'src/contexts';

export const useLiquity = () => {
    const liquityContext = useContext(LiquityContext);

    if (!liquityContext) {
        throw new Error(
            'You must provide a LiquityContext via LiquityProvider'
        );
    }

    return liquityContext;
};
