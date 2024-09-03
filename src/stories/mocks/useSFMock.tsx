import * as jest from 'jest-mock';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        StabilityPool: {
            doDeposit: jest.fn(),
            doWithdraw: jest.fn(),
            doClaim: jest.fn(),
            getCollateralGains: jest.fn(() =>
                Promise.resolve([
                    BigInt('1000000000000000000'),
                    BigInt('2000000000000000000'),
                    BigInt('3000000000000000000'),
                ])
            ),
        },
    };

    return mockSecuredFinance;
};
