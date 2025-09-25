import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, act } from 'src/test-utils.js';
import * as stories from './CustomTooltip.stories';

const { Default, WithCustomButton, WithoutButton } = composeStories(stories);

const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('CustomTooltip Component', () => {
    afterEach(() => {
        spy.mockClear();
    });

    it('should render without errors', () => {
        render(<Default />);
        expect(screen.getByTestId('custom-tooltip-icon')).toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
        render(<Default />);
        const icon = screen.getByTestId('custom-tooltip-icon');

        await act(async () => {
            await userEvent.hover(icon);
        });

        await waitFor(() => {
            expect(screen.getByText('Sample Title')).toBeInTheDocument();
            expect(screen.getByText('Read more')).toBeInTheDocument();
        });
    });

    it('should show custom button text', async () => {
        render(<WithCustomButton />);
        const icon = screen.getByTestId('custom-tooltip-icon');

        await act(async () => {
            await userEvent.hover(icon);
        });

        await waitFor(() => {
            expect(screen.getByText('Learn More')).toBeInTheDocument();
        });
    });

    it('should not show button when buttonText is undefined', async () => {
        render(<WithoutButton />);
        const icon = screen.getByTestId('custom-tooltip-icon');

        await act(async () => {
            await userEvent.hover(icon);
        });

        await waitFor(() => {
            expect(screen.getByText('No Button Tooltip')).toBeInTheDocument();
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    it('should call onButtonClick when provided', async () => {
        const mockClick = jest.fn();
        render(
            <WithCustomButton buttonText='Test' onButtonClick={mockClick} />
        );
        const icon = screen.getByTestId('custom-tooltip-icon');

        await act(async () => {
            await userEvent.hover(icon);
        });

        const button = await screen.findByText('Test');
        await act(async () => {
            await userEvent.click(button);
        });

        expect(mockClick).toHaveBeenCalledTimes(1);
    });
});
