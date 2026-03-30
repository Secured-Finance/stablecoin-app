import { render, screen } from 'src/test-utils.js';
import { StatCard } from './StatCard';

describe('StatCard component', () => {
    it('should render title, description, and value', () => {
        render(
            <StatCard
                title='Test Title'
                description='Test description text'
                value={<span>Test Value</span>}
            />
        );

        const title = screen.getByText('Test Title');
        const description = screen.getByText('Test description text');
        const value = screen.getByText('Test Value');

        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(value).toBeInTheDocument();
    });

    it('should have correct styling classes', () => {
        const { container } = render(
            <StatCard
                title='Test Title'
                description='Test description'
                value='Test Value'
            />
        );

        const cardElement = container.firstChild;
        expect(cardElement).toHaveClass(
            'rounded-xl',
            'border',
            'border-neutral-9',
            'bg-white',
            'p-6'
        );
    });

    it('should render complex React node as value', () => {
        render(
            <StatCard
                title='Complex Value'
                description='Description'
                value={
                    <div className='flex items-center gap-2'>
                        <span>150%</span>
                        <span className='text-success-700'>Low Risk</span>
                    </div>
                }
            />
        );

        expect(screen.getByText('150%')).toBeInTheDocument();
        expect(screen.getByText('Low Risk')).toBeInTheDocument();
    });
});
