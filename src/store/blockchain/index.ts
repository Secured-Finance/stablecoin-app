import blockchainSlice from './reducer';

export const {
    updateLatestBlock,
    updateChainId,
    updateChainError,
    updateTestnetEnabled,
    updateIsChainIdDetected,
} = blockchainSlice.actions;

export default blockchainSlice.reducer;
