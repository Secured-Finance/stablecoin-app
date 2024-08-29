import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Page.stories';

const { Default } = composeStories(stories);

describe('Page Component', () => {
    it('should render a Page', () => {
        render(<Default />);
    });

    it('should add data-testid attribute to the page if name is entered', () => {
        render(<Default name='name' />);
        screen.getByTestId('name');
    });

    it('should not have data-testid attribute to the page if name is not entered', () => {
        render(<Default />);
        expect(screen.queryByTestId('name')).toBeNull();
    });
});
