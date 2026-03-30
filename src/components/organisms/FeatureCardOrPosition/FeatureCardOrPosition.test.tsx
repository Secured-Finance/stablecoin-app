import { composeStories } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FeatureCardOrPosition.stories';

const { ConnectedNoPositions, NotConnected } = composeStories(stories);

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
});
