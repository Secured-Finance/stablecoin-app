import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Positions.stories';
import { MemoryRouter } from 'react-router-dom';

const { Default } = composeStories(stories);

describe('test Positions component', () => {
    it('should render button with a text', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const Text = screen.getByText('1,025.00');
        expect(Text).toBeInTheDocument();
    });
});
