import { render, screen } from 'src/test-utils.js';
import { PriceSourceWarning } from './PriceSourceWarning';

describe('PriceSourceWarning', () => {
    it('renders nothing while the primary oracle is used', () => {
        const { container } = render(
            <PriceSourceWarning
                priceSource='primaryOracle'
                isPriceStale={false}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('explains which actions are restricted with the fallback oracle', () => {
        render(
            <PriceSourceWarning
                priceSource='fallbackOracle'
                isPriceStale={false}
            />
        );

        expect(
            screen.getByText(/opening a Trove, borrowing more/)
        ).toBeInTheDocument();
        expect(screen.getByText(/still add collateral/)).toBeInTheDocument();
    });

    it('shows an error when the last good price is stale', () => {
        render(
            <PriceSourceWarning
                priceSource='lastGoodPrice'
                isPriceStale={true}
            />
        );

        expect(
            screen.getByText(/Market price data has not been updated/)
        ).toBeInTheDocument();
    });

    it('fails closed when the price source is unknown', () => {
        render(
            <PriceSourceWarning priceSource='unknown' isPriceStale={false} />
        );

        expect(
            screen.getByText(/unable to verify the current market price/)
        ).toBeInTheDocument();
    });
});
