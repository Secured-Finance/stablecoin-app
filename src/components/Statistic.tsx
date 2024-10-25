import React from 'react';
import type { Lexicon } from '../lexicon';
import { InfoIcon } from './InfoIcon';

type StatisticProps = React.PropsWithChildren<{
    lexicon: Lexicon;
}>;

export const Statistic: React.FC<StatisticProps> = ({ lexicon, children }) => {
    return (
        <div className='laptop:typography-desktop-body-5 typography-mobile-body-4 flex items-center justify-between border-b border-primary-300 text-neutral-900'>
            <div className='flex items-center'>
                <span>{lexicon.term}</span>
                {lexicon.term && lexicon.description && (
                    <InfoIcon message={lexicon.description} />
                )}
            </div>
            <div className='font-semibold laptop:font-normal'>{children}</div>
        </div>
    );
};
