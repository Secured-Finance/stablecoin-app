import { ArrowUpRight } from 'lucide-react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { coinGeckoUrl } from 'src/constants';

interface TokenPriceProps {
    symbol: string;
    price: string;
    source: string;
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
            <div className='flex items-center gap-1 text-sm text-secondary-400'>
                Source:
                <a
                    href={coinGeckoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-testid='source-url'
                    className='flex items-center gap-1 font-medium hover:underline'
                >
                    <span className='font-primary text-sm font-bold'>
                        {source}
                    </span>
                    <ArrowUpRight className='h-4 w-4' />
                </a>
            </div>
        </div>
    );
}
