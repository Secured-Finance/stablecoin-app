import { composeStories } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TokenPrice.stories';

const { Default } = composeStories(stories);

describe('test TokenPrice component', () => {
    it('should navigate to coingecko with button click', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const button = screen.getByTestId('source-url');
        expect(button).toBeInTheDocument();
    });
});
