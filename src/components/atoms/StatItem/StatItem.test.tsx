import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './StatItem.stories';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const button = screen.getByTestId('link-arrow');
        expect(button).toBeInTheDocument();
    });
});
