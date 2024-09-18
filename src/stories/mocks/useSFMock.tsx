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
        getCollateralConfig: jest.fn(() => [
            {
                NAME: 'tFIL',
            },
            {
                NAME: 'iFIL',
            },
        ]),
        protocolConfig: {
            TOKEN_LIST: [
                {
                    symbol: 'tFIL',
                },
                {
                    symbol: 'iFIL',
                },
                {
                    symbol: 'sfUSD',
                },
            ],
            COLLATERALS: [
                {
                    NAME: 'tFIL',
                },
                {
                    NAME: 'iFIL',
                },
            ],
        },
    };

    return mockSecuredFinance;
};
