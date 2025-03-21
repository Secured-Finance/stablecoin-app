import { Chain, filecoin, filecoinCalibration } from 'viem/chains';
import { isProdEnv } from './isProdEnv';

const testnetChains: readonly [Chain, ...Chain[]] = [filecoinCalibration];
const mainnetChains: readonly [Chain, ...Chain[]] = [filecoin];

export const getSupportedChains = () => {
    return isProdEnv() ? mainnetChains : testnetChains;
};
