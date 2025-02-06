import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MenuExternalLink.stories';

const { Default } = composeStories(stories);

describe('MenuExternalLink component', () => {
    it('should render with correct text', async () => {
        render(<Default />);
        expect(screen.getByText('External Link')).toBeInTheDocument();
    });
});
