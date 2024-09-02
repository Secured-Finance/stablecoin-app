import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './NavTab.stories';

const { Default } = composeStories(stories);

describe('NavTab component', () => {
    it('should render an active Tab', () => {
        render(<Default />);
        expect(screen.getByTestId('Tab-nav-tab')).toBeInTheDocument();
    });
});
