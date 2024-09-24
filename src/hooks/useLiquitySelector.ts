import { LiquityStoreState } from '@liquity/lib-base';
import { useEffect, useReducer } from 'react';
import { equals } from 'src/utils';
import { useLiquityStore } from './useLiquityStore';

export const useLiquitySelector = <S, T>(
    select: (state: LiquityStoreState<T>) => S
): S => {
    const store = useLiquityStore<T>();
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
