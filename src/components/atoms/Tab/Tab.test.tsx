import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Tab.stories';

const { Default } = composeStories(stories);

describe('Tab component', () => {
    it('should render an active Tab', () => {
        render(<Default />);
        expect(screen.getByTestId('Tab-tab')).toBeInTheDocument();
    });
});
