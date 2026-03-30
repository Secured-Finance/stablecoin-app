import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './PositionInfoCard.stories';
import { MemoryRouter } from 'react-router-dom';

const { Default } = composeStories(stories);

describe('test Position Info Card component', () => {
    it('should render text', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );
        const button = screen.getByText('No Trove Yet');
        expect(button).toBeInTheDocument();
    });
});
