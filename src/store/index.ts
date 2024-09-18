import { configureStore } from '@reduxjs/toolkit';
import blockchain from './blockchain';

export const rootReducers = {
    blockchain,
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
