import { composeStories } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FeatureCardOrPosition.stories';

const { ConnectedNoPositions, NotConnected, WithPositions } =
    composeStories(stories);

describe('FeatureCardsOrPositions', () => {
    it('should render feature cards when not connected', () => {
        render(
            <MemoryRouter>
                <NotConnected />
            </MemoryRouter>
        );
        expect(screen.getByText('Borrow USDFC')).toBeInTheDocument();
    });

    it('should render empty positions when connected but no positions exist', () => {
        render(
            <MemoryRouter>
                <ConnectedNoPositions />
            </MemoryRouter>
        );
        expect(screen.getByText('No Trove Yet')).toBeInTheDocument();
        expect(
            screen.getByText('No Stability Pool Deposit Yet')
        ).toBeInTheDocument();
    });

    it('should render positions when connected and positions exist', () => {
        render(
            <MemoryRouter>
                <WithPositions />
            </MemoryRouter>
        );
        expect(screen.getByText('My Positions')).toBeInTheDocument();
        expect(screen.getByText('Trove')).toBeInTheDocument();
        expect(screen.getByText('Stability Pool')).toBeInTheDocument();

        expect(screen.getByText('5,045.00')).toBeInTheDocument(); // debt
        expect(screen.getByText('10.00 FIL')).toBeInTheDocument(); // collateral
    });
});
