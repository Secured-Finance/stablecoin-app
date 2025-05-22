import { ArrowUpRight } from 'lucide-react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { coinGeckoUrl } from 'src/constants';
import { SecuredFinanceLogo } from '../../SecuredFinanceLogo';
interface TokenPriceProps {
    symbol: string;
    price: string;
    source: string;
}

export function TokenPrice({ symbol, price, source }: TokenPriceProps) {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <div className='flex items-center justify-center'>
                    {symbol === 'FIL' ? (
                        <FILIcon />
                    ) : symbol === 'USDFC' ? (
                        <SecuredFinanceLogo />
                    ) : (
                        <span className='text-xs font-bold'>
                            {symbol.charAt(0)}
                        </span>
                    )}
                </div>
                <span className='font-medium'>{symbol}</span>
                <span className='ml-2 text-[#565656]'>{price} USD</span>
            </div>
            <div className='flex items-center gap-1 text-sm text-[#565656]'>
                Source:
                <span className='font-primary text-sm font-bold'>{source}</span>
                <a
                    href={coinGeckoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 font-medium hover:underline'
                >
                    <ArrowUpRight className='h-4 w-4' />
                </a>
            </div>
        </div>
    );
}
