import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FeatureCards.stories';

const { Default } = composeStories(stories);

describe('test FeatureCards component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const Text = screen.getByText('Borrow USDFC');
        expect(Text).toBeInTheDocument();
    });
});
