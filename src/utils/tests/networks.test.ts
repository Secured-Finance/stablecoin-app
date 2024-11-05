import { getSupportedChains } from 'src/utils';
import { filecoin, filecoinCalibration } from 'viem/chains';

describe('networks', () => {
    it('should have one testnet supported chain', () => {
        const supportedNetworks = getSupportedChains();
        expect(supportedNetworks).toHaveLength(1);
        expect(supportedNetworks[0]).toEqual(filecoinCalibration);
    });

    it('should have one testnet and one mainnet supported chain', () => {
        process.env.SF_ENV = 'production';
        const supportedNetworks = getSupportedChains();
        expect(supportedNetworks).toHaveLength(2);
        expect(supportedNetworks[0]).toEqual(filecoin);
    });
});
