import { composeStories } from '@storybook/react';
import { render, screen, fireEvent } from 'src/test-utils.js';
import * as stories from './LinkButton.stories';

const { Default, WithLeftIcon, WithRightIcon, Disabled } =
    composeStories(stories);

describe('LinkButton component', () => {
    it('renders with text', () => {
        render(<Default />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders with left icon', () => {
        render(<WithLeftIcon />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
        expect(screen.getByRole('button').firstChild?.nodeName).toBe('SPAN');
    });

    it('renders with right icon', () => {
        render(<WithRightIcon />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
        expect(screen.getByRole('button').lastChild?.nodeName).toBe('SPAN');
    });

    it('triggers onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Default onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('does not trigger onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<Disabled onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });
});
