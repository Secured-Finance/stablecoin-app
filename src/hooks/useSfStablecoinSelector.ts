import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useEffect, useReducer } from 'react';
import { equals } from 'src/utils';
import { useSfStablecoinStore } from './useSfStablecoinStore';

export const useSfStablecoinSelector = <S, T>(
    select: (state: SfStablecoinStoreState<T>) => S
): S => {
    const store = useSfStablecoinStore<T>();
    const [, rerender] = useReducer(() => ({}), {});

    useEffect(
        () =>
            store.subscribe(({ newState, oldState }) => {
                if (!equals(select(newState), select(oldState))) {
                    rerender();
                }
            }),
        [store, select]
    );

    return select(store.state);
};
