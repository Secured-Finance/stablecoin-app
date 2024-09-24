import { LiquityStore } from '@liquity/lib-base';
import { useContext } from 'react';
import { LiquityStoreContext } from 'src/contexts';

export const useLiquityStore = <T>(): LiquityStore<T> => {
    const store = useContext(LiquityStoreContext);

    if (!store) {
        throw new Error(
            'You must provide a LiquityStore via LiquityStoreProvider'
        );
    }

    return store as LiquityStore<T>;
};
