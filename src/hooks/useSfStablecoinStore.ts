import { SfStablecoinStore } from '@secured-finance/stablecoin-lib-base';
import { useContext } from 'react';
import { SfStablecoinStoreContext } from 'src/contexts';

export const useSfStablecoinStore = <T>(): SfStablecoinStore<T> => {
    const store = useContext(SfStablecoinStoreContext);

    if (!store) {
        throw new Error(
            'You must provide a SfStablecoinStore via SfStablecoinStoreProvider'
        );
    }

    return store as SfStablecoinStore<T>;
};
