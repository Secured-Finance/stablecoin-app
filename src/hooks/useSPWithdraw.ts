import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useSPWithdraw = () => {
    const securedFinance = useSF();

    const handleSPWithdraw = useCallback(
        async (amount: bigint) => {
            if (!securedFinance) {
                return;
            }

            const receipt = await securedFinance.StabilityPool.doWithdraw(
                amount
            );
            return receipt;
        },
        [securedFinance]
    );

    return { onSPWithdraw: handleSPWithdraw };
};
