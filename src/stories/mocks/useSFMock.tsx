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
        TroveManager: {
            doDeposit: jest.fn(
                ({
                    collateral,
                    addedCollAmt,
                }: {
                    collateral: string;
                    addedCollAmt: bigint;
                }) => {
                    return { status: 200, args: { collateral, addedCollAmt } };
                }
            ),
            doWithdraw: jest.fn(),
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
                {
                    symbol: 'SFT',
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
