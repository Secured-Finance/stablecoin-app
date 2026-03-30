import { Decimal, Trove } from '@secured-finance/stablecoin-lib-base';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import { Positions } from './Positions';

jest.mock('src/hooks/SfStablecoinContext', () => ({
    useSfStablecoin: () => ({
        sfStablecoin: {
            send: {
                withdrawGainsFromStabilityPool: jest.fn(),
            },
        },
    }),
}));

jest.mock('src/components/Transaction', () => ({
    useMyTransactionState: () => ({ type: 'idle' }),
    useTransactionFunction: () => [jest.fn()],
}));

describe('Positions component', () => {
    const defaultProps = {
        debtTokenInStabilityPool: Decimal.from('1000'),
        price: Decimal.from('500'),
        trove: Trove.create({
            borrowDebtToken: '1000',
            depositCollateral: '2',
        }),
        originalDeposit: {
            collateralGain: Decimal.from('0.12'),
            currentDebtToken: Decimal.from('500'),
        },
    };

    it('should render positions with correct values', () => {
        render(
            <MemoryRouter>
                <Positions {...defaultProps} />
            </MemoryRouter>
        );
        expect(screen.getByText('My Positions')).toBeInTheDocument();
        expect(screen.getByText('Trove')).toBeInTheDocument();
        expect(screen.getByText('Stability Pool')).toBeInTheDocument();
    });
});
