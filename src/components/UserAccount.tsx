import { Decimal, SfStablecoinStoreState } from '@secured-finance/lib-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import React from 'react';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { AddressUtils } from 'src/utils';
import { Box, Button, Flex, Heading, Text } from 'theme-ui';
import { COIN, GT } from '../strings';
import { Icon } from './Icon';

const select = ({
    accountBalance,
    debtTokenBalance,
    protocolTokenBalance,
}: SfStablecoinStoreState) => ({
    accountBalance,
    debtTokenBalance,
    protocolTokenBalance,
});

export const UserAccount: React.FC = () => {
    const { account } = useSfStablecoin();
    const { open } = useWeb3Modal();
    const { accountBalance, debtTokenBalance, protocolTokenBalance } =
        useSfStablecoinSelector(select);

    return (
        <Flex>
            <Button
                variant='outline'
                sx={{ alignItems: 'center', p: 2, mr: 3 }}
                onClick={() => open()}
            >
                <Icon name='user-circle' size='lg' />
                <Text as='span' sx={{ ml: 2, fontSize: 1 }}>
                    {AddressUtils.format(account, 6)}
                </Text>
            </Button>

            <Box
                sx={{
                    display: ['none', 'flex'],
                    alignItems: 'center',
                }}
            >
                <Icon name='wallet' size='lg' />

                {(
                    [
                        ['tFIL', accountBalance],
                        [COIN, Decimal.from(debtTokenBalance || 0)],
                        [GT, Decimal.from(protocolTokenBalance)],
                    ] as const
                ).map(([currency, balance], i) => (
                    <Flex key={i} sx={{ ml: 3, flexDirection: 'column' }}>
                        <Heading sx={{ fontSize: 1 }}>{currency}</Heading>
                        <Text sx={{ fontSize: 1 }}>{balance.prettify()}</Text>
                    </Flex>
                ))}
            </Box>
        </Flex>
    );
};
