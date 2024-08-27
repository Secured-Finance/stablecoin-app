import { configureStore } from '@reduxjs/toolkit';
import blockchain from './blockchain';
import interactions from './interactions';
import lastError from './lastError';
import wallet from './wallet';

export const rootReducers = {
    blockchain,
    interactions,
    lastError,
    wallet,
};

const store = configureStore({
    reducer: rootReducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['landingOrderForm/setAmount'],
            },
        }),
});

export default store;
export type AppDispatch = typeof store.dispatch;
