import Link from 'next/link';
import React from 'react';
import ExternalLink from 'src/assets/icons/external-link.svg';
import { Box, Card, Flex, Heading } from 'theme-ui';
import { InfoMessage } from './InfoMessage';

export const FixedIncome: React.FC = () => {
    return (
        <Card>
            <Heading>Fixed Income Market</Heading>
            <Box sx={{ p: [2, 3] }}>
                <InfoMessage title=''>
                    Lend USDFC to earn fixed returns and acquire zero-coupon
                    bonds.
                </InfoMessage>

                <Flex variant='layout.actions'>
                    <Link
                        href={'https://app.secured.finance/'}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Fixed Income'
                    >
                        <div className='flex h-8 items-center gap-x-1.5 rounded-[8px] px-2 ring-1 ring-neutral-300 hover:ring-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:rounded-[10px] laptop:px-3.5 laptop:ring-[1.5px]'>
                            <span className='text-3 leading-5 text-neutral-900 laptop:text-3.5 laptop:leading-4.5'>
                                Go to Market
                            </span>
                            <ExternalLink className='h-4 w-4' />
                        </div>
                    </Link>
                </Flex>
            </Box>
        </Card>
    );
};
