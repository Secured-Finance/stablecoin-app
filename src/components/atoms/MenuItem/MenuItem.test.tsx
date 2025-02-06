import { composeStories } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MenuItem.stories';

const { Default } = composeStories(stories);

describe('MenuItem component', () => {
    it('should render with correct text', async () => {
        render(
            <BrowserRouter>
                <Default />
            </BrowserRouter>
        );
        expect(screen.getByText('Example')).toBeInTheDocument();
    });
});
