import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useSPWithdraw = (amount: bigint) => {
    const securedFinance = useSF();

    const handleSPWithdraw = useCallback(async () => {
        if (!securedFinance) {
            return;
        }

        const receipt = await securedFinance.StabilityPool.doWithdraw(amount);
        return receipt;
    }, [amount, securedFinance]);

    return { onSPWithdraw: handleSPWithdraw };
};
