import { fireEvent, render, screen } from 'src/test-utils.js';
import { TransactionModal } from './TransactionModal';

describe.skip('TransactionModal', () => {
    const defaultProps = {
        isOpen: true,
        type: 'processing' as const,
        title: 'Test Title',
        description: 'Test Description',
    };

    it('should not render when isOpen is false', () => {
        render(<TransactionModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should render processing modal with spinner', () => {
        render(<TransactionModal {...defaultProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should render confirm modal with wallet icon', () => {
        render(<TransactionModal {...defaultProps} type='confirm' />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should display and handle transaction hash click', () => {
        const mockOnViewTransaction = jest.fn();
        render(
            <TransactionModal
                {...defaultProps}
                transactionHash='0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2'
                onViewTransaction={mockOnViewTransaction}
            />
        );

        const hashButton = screen.getByText('0x87B3...D8E0');
        expect(hashButton).toBeInTheDocument();

        fireEvent.click(hashButton);
        expect(mockOnViewTransaction).toHaveBeenCalledTimes(1);
    });

    it.skip('should truncate transaction hash correctly', () => {
        render(
            <TransactionModal
                {...defaultProps}
                transactionHash='0x87B3E4D2F1A5B7C9E6F8A1B3C5D7E9F0A2B4C6D8E0F2'
            />
        );

        expect(screen.getByText('0x87B3...D8E0')).toBeInTheDocument();
    });
});
