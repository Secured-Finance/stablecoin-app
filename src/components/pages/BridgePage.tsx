import React from 'react';
import { squidConfig } from 'src/utils';

export const BridgePage: React.FC = () => {
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <section className='mt-5 flex justify-center overflow-hidden rounded-2xl'>
            <iframe
                title='squid_widget'
                width='390'
                height='684'
                src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
            />
        </section>
    );
};
