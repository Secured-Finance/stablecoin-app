import { composeStories } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { REDSTONE_ORACLE_LINKS } from 'src/constants';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TokenPrice.stories';

const { Default } = composeStories(stories);

describe('test TokenPrice component', () => {
    it('should render RedStone link with correct href', () => {
        render(
            <MemoryRouter>
                <Default />
            </MemoryRouter>
        );

        const link = screen.getByTestId('RedStone');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', REDSTONE_ORACLE_LINKS.testnet);
        expect(link).toHaveAttribute('target', '_blank');
    });
});
