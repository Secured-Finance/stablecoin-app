import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Interactions = {
    walletDialogOpen: boolean;
    theme: 'light' | 'dark';
};

const initialState: Interactions = {
    walletDialogOpen: false,
    theme: 'light',
};

export const interactionsSlice = createSlice({
    name: 'interactions',
    initialState,
    reducers: {
        setWalletDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.walletDialogOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
    },
});
