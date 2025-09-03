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
        <section className='md:px-16 flex w-full flex-col items-center px-4'>
            <div className='flex flex-col items-center gap-6 text-center'>
                <h1 className='font-primary text-[24px] font-semibold leading-[29px] text-[#002133]'>
                    Bridge Assets
                </h1>
                <p className='mt-2 font-primary text-[16px] font-normal leading-[23px] text-[#565656]'>
                    Seamlessly transfer assets to and from the Filecoin network.
                </p>
            </div>
            <div className='relative mt-5 flex justify-center'>
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
