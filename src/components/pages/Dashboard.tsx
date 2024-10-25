import { FixedIncome } from 'src/components/FixedIncome';
import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';
import { Container } from 'theme-ui';

export const Dashboard: React.FC = () => (
    <Container variant='columns'>
        <Container variant='left'>
            <Trove />
            <Stability />
            <FixedIncome />
        </Container>

        <Container variant='right'>
            <SystemStats />
            <PriceManager />
        </Container>
    </Container>
);
