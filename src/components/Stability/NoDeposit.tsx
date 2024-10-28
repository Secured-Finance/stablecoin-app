import React, { useCallback } from 'react';
import { Button } from 'src/components/atoms';
import { Box, Card, Flex, Heading } from 'theme-ui';
import { InfoMessage } from '../InfoMessage';
import { useStabilityView } from './context/StabilityViewContext';

export const NoDeposit: React.FC = () => {
    const { dispatchEvent } = useStabilityView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('DEPOSIT_PRESSED');
    }, [dispatchEvent]);

    return (
        <Card>
            <Heading>
                Stability Pool
                {/* <Flex sx={{ justifyContent: 'flex-end' }}>
                    <RemainingProtocolToken />
                </Flex> */}
            </Heading>
            <Box sx={{ p: [2, 3] }}>
                <InfoMessage title='You have no USDFC in the Stability Pool.'>
                    You can earn tFIL rewards by depositing USDFC.
                </InfoMessage>

                <Flex variant='layout.actions'>
                    {/* <Flex
                        sx={{
                            justifyContent: 'flex-start',
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Yield />
                    </Flex> */}
                    <Button onClick={handleOpenTrove}>Deposit</Button>
                </Flex>
            </Box>
        </Card>
    );
};
