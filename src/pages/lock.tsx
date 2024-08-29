import { useEffect, useState } from 'react';
import { Page } from 'src/components/templates';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Page name='lock'>
            <div className='flex h-full flex-col items-center justify-center gap-2'>
                <span className='text-16 text-white'>
                    Welcome to the Stable Coin Project!
                </span>
            </div>
        </Page>
    );
}

export default EntryPoint;
