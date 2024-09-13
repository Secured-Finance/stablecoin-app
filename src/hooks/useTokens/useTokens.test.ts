import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useTokens } from './useTokens';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useTokens', () => {
    it('should return the list of tokens', async () => {
        const { result } = renderHook(() => useTokens());
        await waitFor(() =>
            expect(result.current).toEqual([
                CurrencySymbol.tFIL,
                CurrencySymbol.iFIL,
                CurrencySymbol.sfUSD,
            ])
        );
    });

    it('should return the list of all supported tokens in order', async () => {
        mock.protocolConfig.TOKEN_LIST = [
            {
                symbol: 'iFIL',
            },
            {
                symbol: 'tFIL',
            },
        ];
        const { result } = renderHook(() => useTokens());
        await waitFor(() =>
            expect(result.current).toEqual([
                CurrencySymbol.tFIL,
                CurrencySymbol.iFIL,
            ])
        );
    });

    it('should filter out tokens that are not supported', async () => {
        mock.protocolConfig.TOKEN_LIST = [
            {
                symbol: 'iFIL',
            },
            {
                symbol: 'wFIL',
            },
        ];
        const { result } = renderHook(() => useTokens());
        await waitFor(() =>
            expect(result.current).toEqual([CurrencySymbol.iFIL])
        );
    });
});
