// Alert.test.tsx
import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Alert.stories';

const { Error: ErrorAlert, Warning, Info } = composeStories(stories);

describe('test Alert component', () => {
    it('should render Error alert with text', () => {
        render(<ErrorAlert />);
        const alertText = screen.getByText('This is an error alert message');
        expect(alertText).toBeInTheDocument();
        const alertContainer = alertText.closest('div');
        expect(alertContainer).toHaveClass(
            'border-error-300',
            'bg-error-500/10'
        );
    });

    it('should render Warning alert with text', () => {
        render(<Warning />);
        const alertText = screen.getByText('This is a warning alert message');
        expect(alertText).toBeInTheDocument();
        const alertContainer = alertText.closest('div');
        expect(alertContainer).toHaveClass(
            'border-warning-300',
            'bg-warning-500/10'
        );
    });

    it('should render Info alert with text', () => {
        render(<Info />);
        const alertText = screen.getByText('This is an info alert message');
        expect(alertText).toBeInTheDocument();
        const alertContainer = alertText.closest('div');
        expect(alertContainer).toHaveClass(
            'border-primary-300',
            'bg-primary-500/10'
        );
    });

    it('should render Info icon when color is info', () => {
        render(<Info />);
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
    });

    it('should render Alert icon when color is error', () => {
        render(<ErrorAlert />);
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
    });
});
