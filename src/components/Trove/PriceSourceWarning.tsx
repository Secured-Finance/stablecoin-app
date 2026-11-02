import { PriceSource } from '@secured-finance/stablecoin-lib-base';
import { Alert } from 'src/components/atoms';

type PriceSourceWarningProps = {
    priceSource: PriceSource;
    isPriceStale: boolean;
};

export const PriceSourceWarning: React.FC<PriceSourceWarningProps> = ({
    priceSource,
    isPriceStale,
}) => {
    if (isPriceStale) {
        return (
            <Alert color='error'>
                Market price data has not been updated for an extended period.
                For safety, Trove actions are temporarily unavailable. Please
                try again later.
            </Alert>
        );
    }

    if (priceSource === 'unknown') {
        return (
            <Alert color='error'>
                We&apos;re unable to verify the current market price. For
                safety, Trove actions are temporarily unavailable. Please try
                again later.
            </Alert>
        );
    }

    if (priceSource === 'primaryOracle') {
        return null;
    }

    return (
        <Alert color='warning'>
            We&apos;re temporarily unable to fully verify the latest market
            price. For safety, opening a Trove, borrowing more, and withdrawing
            collateral are unavailable. You can still add collateral, repay
            debt, or close your Trove.
        </Alert>
    );
};
