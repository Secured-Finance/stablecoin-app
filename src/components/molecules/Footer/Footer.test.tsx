import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Footer.stories';
import { MemoryRouter } from 'react-router-dom';

const { Default } = composeStories(stories);

describe('test Footer component', () => {
    it('should have social link buttons', async () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const button = screen.getByTestId('btn1');
        expect(button).toBeInTheDocument();
    });
});
