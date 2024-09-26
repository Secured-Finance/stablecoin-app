import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { Staking } from 'src/components/Staking/Staking';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';
import { Container } from 'theme-ui';

export const Dashboard: React.FC = () => (
    <Container variant='columns'>
        <Container variant='left'>
            <Trove />
            <Stability />
            <Staking />
        </Container>

        <Container variant='right'>
            <SystemStats />
            <PriceManager />
        </Container>
    </Container>
);
