import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './EmptyPositions.stories';
import { MemoryRouter } from 'react-router-dom';

const { Default } = composeStories(stories);

describe('Empty Positions component', () => {
    it('should have a button with text Create Trove', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const button = screen.getByText('Create Trove');
        expect(button).toBeInTheDocument();
    });
});
