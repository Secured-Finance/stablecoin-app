import { useSelector } from 'react-redux';
import { CoinDetailsCard } from 'src/components/molecules';
import { Page } from 'src/components/templates';
import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils';
import { useAccount } from 'wagmi';

export const Vaults = () => {
    const { address, isConnecting, isDisconnected } = useAccount();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    return (
        <Page name='vaults'>
            <div className='flex h-full flex-col items-center justify-center gap-2'>
                <span className='text-16 text-foreground'>
                    Welcome to the Stable Coin Project!
                </span>
                <span>
                    {isConnecting
                        ? 'Connecting...'
                        : isDisconnected
                        ? 'Disconnected'
                        : address}
                </span>
                <span>{chainId}</span>
                <span>{block}</span>
                <div className='flex flex-row gap-3'>
                    <CoinDetailsCard currency={CurrencySymbol.FIL} />
                    <CoinDetailsCard currency={CurrencySymbol.iFIL} />
                </div>
            </div>
        </Page>
    );
};
