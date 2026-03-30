import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FeatureCards.stories';
import { MemoryRouter } from 'react-router-dom';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should render button with a text', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const Text = screen.getByText('Borrow USDFC');
        expect(Text).toBeInTheDocument();
    });
});
