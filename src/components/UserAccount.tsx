import { Decimal, LiquityStoreState } from '@liquity/lib-base';
import { useLiquitySelector } from '@liquity/lib-react';
import React from 'react';
import { Box, Flex, Heading, Text } from 'theme-ui';
import { COIN, GT } from '../strings';
import { Icon } from './Icon';

const select = ({
    accountBalance,
    lusdBalance,
    lqtyBalance,
}: LiquityStoreState) => ({
    accountBalance,
    lusdBalance,
    lqtyBalance,
});

export const UserAccount: React.FC = () => {
    // const { account } = useLiquity();
    const { accountBalance, lusdBalance, lqtyBalance } =
        useLiquitySelector(select);
    // const { bLusdBalance, lusdBalance: customLusdBalance } = useBondView();
    // const { LUSD_OVERRIDE_ADDRESS } = useBondAddresses();

    return (
        <Flex>
            {/* <ConnectKitButton.Custom>
                {connectKit => (
                    <Button
                        variant='outline'
                        sx={{ alignItems: 'center', p: 2, mr: 3 }}
                        onClick={connectKit.show}
                    >
                        <Icon name='user-circle' size='lg' />
                        <Text as='span' sx={{ ml: 2, fontSize: 1 }}>
                            {AddressUtils.format(account, 6)}
                        </Text>
                    </Button>
                )}
            </ConnectKitButton.Custom> */}

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
                        [COIN, Decimal.from(lusdBalance || 0)],
                        [GT, Decimal.from(lqtyBalance)],
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
