import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useSPDeposit = () => {
    const securedFinance = useSF();

    const handleSPDeposit = useCallback(
        async (amount: bigint) => {
            if (!securedFinance) {
                return;
            }

            const receipt = await securedFinance.StabilityPool.doDeposit(
                amount
            );
            return receipt;
        },
        [securedFinance]
    );

    return { onSPDeposit: handleSPDeposit };
};
