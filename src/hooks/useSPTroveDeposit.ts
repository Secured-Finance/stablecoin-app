import { useCallback } from 'react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';

export const useSPTroveDeposit = () => {
    const securedFinance = mockUseSF();

    const handleSPTroveDeposit = useCallback(
        async (collateral: string, addedCollAmt: bigint) => {
            if (!securedFinance) {
                return;
            }

            try {
                const receipt = securedFinance.TroveManager.doDeposit({
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
