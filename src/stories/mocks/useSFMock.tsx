import * as jest from 'jest-mock';
import { CollateralConfig } from 'satoshi-sdk';

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
            doDeposit: ({
                collateral,
                addedCollAmt,
            }: {
                collateral: CollateralConfig;
                addedCollAmt: bigint;
            }) => {
                return { status: 200, args: { collateral, addedCollAmt } };
            },
            doWithdraw: jest.fn(),
        },
    };

    return mockSecuredFinance;
};
