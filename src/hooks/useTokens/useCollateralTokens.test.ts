import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCollateralTokens } from './useCollateralTokens';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCollateralTokens', () => {
    it('should return the list of collateral tokens', async () => {
        const { result } = renderHook(() => useCollateralTokens());
        await waitFor(() =>
            expect(result.current).toEqual([
                CurrencySymbol.tFIL,
                CurrencySymbol.iFIL,
            ])
        );
    });

    it('should return the list of all supported collateral tokens in order', async () => {
        jest.spyOn(mock, 'getCollateralConfig').mockImplementationOnce(() => [
            {
                NAME: 'iFIL',
            },
            {
                NAME: 'tFIL',
            },
        ]);
        const { result } = renderHook(() => useCollateralTokens());
        await waitFor(() =>
            expect(result.current).toEqual([
                CurrencySymbol.tFIL,
                CurrencySymbol.iFIL,
            ])
        );
    });

    it('should filter out collateral tokens that are not supported', async () => {
        jest.spyOn(mock, 'getCollateralConfig').mockImplementationOnce(() => [
            {
                NAME: 'tFIL',
            },
            {
                NAME: 'wFIL',
            },
        ]);
        const { result } = renderHook(() => useCollateralTokens());
        await waitFor(() =>
            expect(result.current).toEqual([CurrencySymbol.tFIL])
        );
    });
});
