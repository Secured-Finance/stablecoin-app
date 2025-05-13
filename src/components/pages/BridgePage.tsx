import React, { useEffect, useMemo, useState } from 'react';
import { squidConfig } from 'src/configs';
import { useBreakpoint } from 'src/hooks';
import { useAccount } from 'wagmi';

export const BridgePage: React.FC = () => {
    const isMobile = useBreakpoint('tablet');
    const { address } = useAccount();
    const [iframeKey, setIframeKey] = useState<number>(0);

    const dynamicConfig = useMemo(() => {
        const config = { ...squidConfig };

        if (address) {
            config.initialAssets = {
                ...config.initialAssets,
                from: {
                    ...config.initialAssets.from,
                    address: address,
                },
            };
        }

        return config;
    }, [address]);

    const configQueryParam = encodeURIComponent(JSON.stringify(dynamicConfig));

    useEffect(() => {
        setIframeKey(prevKey => prevKey + 1);
    }, [address]);

    return (
        <section className='w-full'>
            <div className='border-red relative mt-5 flex justify-center'>
                <iframe
                    key={iframeKey}
                    className='rounded-xl border border-transparent bg-neutral-50 shadow-card'
                    title='squid_widget'
                    width={isMobile ? '370' : '480'}
                    height='694'
                    src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
                />
            </div>
        </section>
    );
};
