import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TokenPrice.stories';
import { MemoryRouter } from 'react-router-dom';
import { PYTH_ORACLE_LINK } from 'src/constants';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should render Pyth link with correct href', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );

        const link = screen.getByTestId('Pyth');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', PYTH_ORACLE_LINK);
        expect(link).toHaveAttribute('target', '_blank');
    });
});
