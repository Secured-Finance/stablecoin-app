import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useSPDeposit = (amount: bigint) => {
    const securedFinance = useSF();

    const handleSPDeposit = useCallback(async () => {
        if (!securedFinance) {
            return;
        }

        const receipt = await securedFinance.StabilityPool.doDeposit(amount);
        return receipt;
    }, [amount, securedFinance]);

    return { onSPDeposit: handleSPDeposit };
};
