import { composeStories } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Positions.stories';

const { Default } = composeStories(stories);

describe.skip('test Positions component', () => {
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
