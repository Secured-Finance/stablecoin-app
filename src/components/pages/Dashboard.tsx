import { PriceManager } from 'src/components/PriceManager';
import { Stability } from 'src/components/Stability/Stability';
import { SystemStats } from 'src/components/SystemStats';
import { Trove } from 'src/components/Trove/Trove';
import { Container } from 'theme-ui';

export const Dashboard: React.FC = () => (
    <Container variant='columns' className='px-5 laptop:px-0'>
        <Container variant='left' className='laptop:!pr-5'>
            <Trove />
            <Stability />
        </Container>

        <Container variant='right'>
            <SystemStats />
            <PriceManager />
        </Container>
    </Container>
);
