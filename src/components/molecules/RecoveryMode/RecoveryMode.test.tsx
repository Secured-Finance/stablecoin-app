import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './RecoveryMode.stories';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should render with a text for inactive ', () => {
        render(<Default />);
        const isActive = screen.getByText('Inactive');
        expect(isActive).toBeInTheDocument();
    });
});
