import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TokenPrice.stories';
import { MemoryRouter } from 'react-router-dom';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should navigate to coingecko with button click', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const button = screen.getByTestId('source-url1');
        expect(button).toBeInTheDocument();
    });
});
