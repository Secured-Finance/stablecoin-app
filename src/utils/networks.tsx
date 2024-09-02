import Ethereum from 'src/assets/icons/ethereum-network.svg';
import Filecoin from 'src/assets/icons/filecoin-network.svg';
import {
    Chain,
    filecoin,
    filecoinCalibration,
    mainnet,
    sepolia,
} from 'viem/chains';
import { isProdEnv } from './isProdEnv';

type ChainInformation = {
    chain: Chain;
    icon: React.ReactNode;
};

// it is important to keep sepolia as first chain in this list
const testnetNetworks: Chain[] = [sepolia, filecoinCalibration];

// it is important to keep mainnet as first chain in this list
const mainnetNetworks: Chain[] = [mainnet, filecoin];

export const getSupportedNetworks = () => {
    return isProdEnv()
        ? mainnetNetworks.concat(testnetNetworks)
        : testnetNetworks;
};

export const SupportedChainsList: ChainInformation[] = [
    {
        chain: mainnet,
        icon: (
            <Ethereum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: sepolia,
        icon: (
            <Ethereum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
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
