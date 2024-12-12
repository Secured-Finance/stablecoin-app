import React from 'react';
import { squidConfig } from 'src/config';
import { useBreakpoint } from 'src/hooks';

export const BridgePage: React.FC = () => {
    const isMobile = useBreakpoint('tablet');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <section className='mt-5 flex justify-center overflow-hidden rounded-2xl'>
            <iframe
                title='squid_widget'
                width={isMobile ? '351' : '430'}
                height='684'
                src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
            />
        </section>
    );
};
