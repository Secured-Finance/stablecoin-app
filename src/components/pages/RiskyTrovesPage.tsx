import React from 'react';
import { InfoMessage } from 'src/components/InfoMessage';
import { LiquidationManager } from 'src/components/LiquidationManager';
import { RiskyTroves } from 'src/components/RiskyTroves';
import { SystemStats } from 'src/components/SystemStats';
import { Box, Card, Container, Paragraph } from 'theme-ui';

export const RiskyTrovesPage: React.FC = () => (
    <Container
        variant='main'
        sx={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <Container variant='columns'>
            <Container variant='left'>
                <Card>
                    <Box sx={{ p: [2, 3] }}>
                        <InfoMessage title='Bot functionality'>
                            <Paragraph>
                                Liquidation is expected to be carried out by
                                bots.
                            </Paragraph>
                            <Paragraph>
                                Early on you may be able to manually liquidate
                                Troves, but as the system matures this will
                                become less likely.
                            </Paragraph>
                        </InfoMessage>
                    </Box>
                </Card>
                <LiquidationManager />
            </Container>
            <Container variant='right'>
                <SystemStats />
            </Container>
            <RiskyTroves pageSize={10} />
        </Container>
    </Container>
);
