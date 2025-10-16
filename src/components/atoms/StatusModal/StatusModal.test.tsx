import { fireEvent, render, screen } from 'src/test-utils.js';
import { StatusModal } from './StatusModal';

describe('StatusModal', () => {
    const defaultProps = {
        isOpen: true,
        type: 'processing' as const,
        title: 'Test Title',
        description: 'Test Description',
    };

    it('should not render when isOpen is false', () => {
        render(<StatusModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should render title and description', () => {
        render(<StatusModal {...defaultProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should handle onClose callback', () => {
        const mockOnClose = jest.fn();
        render(
            <StatusModal
                {...defaultProps}
                type='confirmed'
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should render custom actions and handle clicks', () => {
        const mockAction = jest.fn();
        const customActions = [
            {
                label: 'Custom Action',
                onClick: mockAction,
                variant: 'primary' as const,
            },
        ];

        render(<StatusModal {...defaultProps} customActions={customActions} />);

        const actionButton = screen.getByText('Custom Action');
        fireEvent.click(actionButton);
        expect(mockAction).toHaveBeenCalledTimes(1);
    });
});
