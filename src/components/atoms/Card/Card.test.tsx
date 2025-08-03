import { composeStories } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Card.stories';

const { Default } = composeStories(stories);

describe('Card component', () => {
    it('should have a button with text Create Trove', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const button = screen.getByText('Card Title');
        expect(button).toBeInTheDocument();
    });
});
