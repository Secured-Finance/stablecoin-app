import React from 'react';
import { Flex } from 'theme-ui';
import type { Lexicon } from '../lexicon';
import { InfoIcon } from './InfoIcon';

type StatisticProps = React.PropsWithChildren<{
    lexicon: Lexicon;
}>;

export const Statistic: React.FC<StatisticProps> = ({ lexicon, children }) => {
    return (
        <Flex sx={{ borderBottom: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }}>
            <Flex
                sx={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flex: 1.2,
                    fontWeight: 200,
                }}
            >
                <Flex>{lexicon.term}</Flex>
                {lexicon.term && (
                    <InfoIcon
                        size='xs'
                        tooltip={lexicon.description}
                        link={lexicon.link}
                    />
                )}
            </Flex>
            <Flex
                sx={{
                    justifyContent: 'flex-end',
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                {children}
            </Flex>
        </Flex>
    );
};
