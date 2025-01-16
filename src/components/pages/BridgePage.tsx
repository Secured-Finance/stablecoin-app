import React from 'react';
import { Page } from 'src/components/templates';
import { squidConfig } from 'src/configs';
import { useBreakpoint } from 'src/hooks';

export const BridgePage: React.FC = () => {
    const isMobile = useBreakpoint('tablet');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <Page name='bridge'>
            <section className='border-red relative mt-5 flex justify-center overflow-hidden rounded-[1.875rem] border bg-[#F8FAFC] tablet:h-[660px]'>
                <iframe
                    title='squid_widget'
                    width={isMobile ? '370' : '480'}
                    height='694'
                    src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
                />
            </section>
        </Page>
    );
};
