import { Fragment } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';

interface TokenPriceProps {
    symbol: string;
    price: string;
    sources: {
        name: string;
        href: string;
    }[];
}

export function TokenPrice({ symbol, price, sources }: TokenPriceProps) {
    return (
        <div className='flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between'>
            <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center'>
                    <FILIcon className='h-8 w-8' />
                </div>
                <span className='font-medium'>{symbol}</span>
                <span className='font-primary text-secondary-400'>
                    {price} USD
                </span>
            </div>

            <div className='flex items-center gap-2 text-sm text-secondary-400'>
                <span>Source:</span>
                <div className='flex items-center gap-2'>
                    {sources.map(({ name, href }, i) => {
                        return (
                            <Fragment key={i}>
                                <a
                                    key={i}
                                    href={href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-1 font-medium hover:underline'
                                    data-testid={`${name}`}
                                >
                                    <span className='font-primary text-sm font-bold text-primary-500'>
                                        {name}
                                    </span>
                                </a>
                                {i < sources.length - 1 && <span>|</span>}
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
