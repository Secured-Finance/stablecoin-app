import Filecoin from 'src/assets/icons/filecoin-network.svg';
import { Chain, filecoin, filecoinCalibration } from 'viem/chains';
import { isProdEnv } from './isProdEnv';

type ChainInformation = {
    chain: Chain;
    icon: React.ReactNode;
};

const testnetChains: readonly [Chain, ...Chain[]] = [filecoinCalibration];
const mainnetChains: readonly [Chain, ...Chain[]] = [filecoin];

export const getSupportedChains = () => {
    return isProdEnv() ? mainnetChains : testnetChains;
};

export const SupportedChainsList: ChainInformation[] = [
    {
        chain: filecoin,
        icon: (
            <Filecoin className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: filecoinCalibration,
        icon: (
            <Filecoin className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
];
