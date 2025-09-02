import React from 'react';
import { squidConfig } from 'src/configs';
import { useBreakpoint } from 'src/hooks';

export const BridgePage: React.FC = () => {
    const isMobile = useBreakpoint('tablet');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

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
