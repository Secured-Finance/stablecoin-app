import { mockUseSF } from '@/stories/mocks/useSFMock';
import { useCallback } from 'react';
import { CollateralConfig } from 'satoshi-sdk';

export const useSPTroveDeposit = () => {
    const securedFinance = mockUseSF();

    const handleSPTroveDeposit = useCallback(
        async (collateral: CollateralConfig, addedCollAmt: bigint) => {
            if (!securedFinance) {
                return;
            }

            try {
                const receipt = await securedFinance.TroveManager.doDeposit({
                    collateral,
                    addedCollAmt,
                });
                return receipt;
            } catch (err) {}
        },
        [securedFinance]
    );

    return { onSPTroveDeposit: handleSPTroveDeposit };
};
