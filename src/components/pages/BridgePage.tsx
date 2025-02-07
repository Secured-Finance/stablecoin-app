import React from 'react';
import { squidConfig } from 'src/configs';
import { useBreakpoint } from 'src/hooks';

export const BridgePage: React.FC = () => {
    const isMobile = useBreakpoint('tablet');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <section className='w-full'>
            <div className='border-red relative mt-5 flex justify-center'>
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
