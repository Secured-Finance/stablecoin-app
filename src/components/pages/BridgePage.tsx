import React from 'react';
import { useBreakpoint } from 'src/hooks';
import { squidConfig } from 'src/utils';

export const BridgePage: React.FC = () => {
    const isMobile = useBreakpoint('laptop');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <section className='mt-5 flex justify-center overflow-hidden rounded-2xl'>
            <iframe
                title='squid_widget'
                width={isMobile ? '390' : '430'}
                height='684'
                src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
            />
        </section>
    );
};
