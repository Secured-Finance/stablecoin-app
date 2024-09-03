import { SatoshiClient } from 'satoshi-sdk';
import { Context } from 'src/contexts/SecuredFinanceProvider';
import { mockUseSF } from './useSFMock';

const satoshiClient = mockUseSF() as unknown as SatoshiClient;

export const MockSecuredFinanceProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Context.Provider value={{ satoshiClient }}>
            {children}
        </Context.Provider>
    );
};
