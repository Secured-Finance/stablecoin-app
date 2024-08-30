import { useEffect, useState } from 'react';
import { Page } from 'src/components/templates';
import { useAccount } from 'wagmi';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);
    const { address, isConnecting, isDisconnected } = useAccount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Page name='vaults'>
            <div className='flex h-full flex-col items-center justify-center gap-2'>
                <span className='text-16 text-black dark:text-white'>
                    Welcome to the Stable Coin Project!
                </span>
                <span>
                    {isConnecting
                        ? 'Connecting...'
                        : isDisconnected
                        ? 'Disconnected'
                        : address}
                </span>
            </div>
        </Page>
    );
}

export default EntryPoint;
