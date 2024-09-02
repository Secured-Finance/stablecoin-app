import { useCallback } from 'react';
import { ZERO_BI } from 'src/utils';
import useSF from './useSecuredFinance';

export const useSPClaim = () => {
    const securedFinance = useSF();

    const handleSPClaim = useCallback(async () => {
        if (!securedFinance) {
            return '';
        }
        const collaterals = securedFinance.getCollateralConfig();
        const collateralGains =
            await securedFinance.StabilityPool.getCollateralGains();

        for (let i = 0; i < collaterals.length; i++) {
            const gain = collateralGains[i];

            // Check if there is a gain
            if (gain > ZERO_BI) {
                const receipt = await securedFinance.StabilityPool.doClaim();
                return receipt;
            }
        }

        return '';
    }, [securedFinance]);

    return handleSPClaim;
};
