import { Fragment } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';

interface TokenPriceProps {
    symbol: string;
    price: string;
    source: {
        source: string;
        href: string;
    }[];
}

export function TokenPrice({ symbol, price, source }: TokenPriceProps) {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
                <div className='flex h-6 w-6 items-center'>
                    <FILIcon />
                </div>
                <span className='font-medium'>{symbol}</span>
                <span className='ml-2 font-primary text-secondary-400'>
                    {price} USD
                </span>
            </div>

            <div className='flex items-center gap-2 text-sm text-secondary-400'>
                Source:
                {source.map(({ source, href }, i) => {
                    return (
                        <Fragment key={i}>
                            {i > 0 && <span>|</span>}
                            <a
                                key={i}
                                href={href}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-1 font-medium hover:underline'
                                data-testid={`source-url${i}`}
                            >
                                <span className='font-primary text-sm font-bold text-primary-500'>
                                    {source}
                                </span>
                            </a>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}
