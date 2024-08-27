import { configureStore } from '@reduxjs/toolkit';
import store, { rootReducers } from 'src/store';

export const initialStore = {
    ...store.getState(),
    blockchain: {
        ...store.getState().blockchain,
        chainId: 11155111,
        chainError: false,
        testnetEnabled: true,
        isChainIdDetected: true,
    },
};

export const mockStore = configureStore({
    reducer: rootReducers,
    preloadedState: initialStore,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
