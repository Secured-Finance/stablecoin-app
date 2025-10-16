import { Fragment, ReactNode, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';

interface TokenPriceProps {
    symbol: string;
    price: string;
    displayPrice?: string;
    sources: {
        name: string;
        href: string;
    }[];
    canSetPrice?: boolean;
    onPriceChange?: (value: string) => void;
    setPriceAction?: ReactNode;
}

export function TokenPrice({
    symbol,
    price,
    displayPrice,
    sources,
    canSetPrice = false,
    onPriceChange,
    setPriceAction,
}: TokenPriceProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className='flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between'>
            <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center'>
                    <FILIcon className='h-6 w-6' />
                </div>
                <span className='font-primary text-xl font-medium text-neutral-900'>
                    {symbol}
                </span>
                {canSetPrice && isEditing ? (
                    <div className='relative flex h-11 w-32 items-center gap-1 overflow-hidden'>
                        <span className='absolute left-2 top-1/2 -translate-y-1/2 font-primary text-xl font-semibold leading-normal'>
                            $
                        </span>
                        <input
                            type='number'
                            step='any'
                            min='0'
                            value={price}
                            onChange={e => onPriceChange?.(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            className='h-full w-full rounded-md border border-neutral-300 bg-neutral-50 py-2 pl-6 pr-3 font-primary text-xl font-semibold [appearance:textfield] focus:border-primary-500 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                        />
                    </div>
                ) : canSetPrice ? (
                    <button
                        className='flex h-11 min-w-32 items-center whitespace-nowrap px-3 font-primary text-xl font-normal text-secondary-400 hover:underline'
                        onClick={() => setIsEditing(true)}
                    >
                        {displayPrice || price} USD
                    </button>
                ) : (
                    <span className='whitespace-nowrap font-primary text-xl font-normal text-secondary-400'>
                        {displayPrice || price} USD
                    </span>
                )}
                {canSetPrice && setPriceAction && (
                    <div className='flex items-center'>{setPriceAction}</div>
                )}
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
