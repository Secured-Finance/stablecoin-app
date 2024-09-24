import { SatoshiClient } from 'satoshi-sdk';
import { SecuredFinanceContext } from 'src/contexts/SecuredFinanceProvider';
import { mockUseSF } from './useSFMock';

const satoshiClient = mockUseSF() as unknown as SatoshiClient;

export const MockSecuredFinanceProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <SecuredFinanceContext.Provider value={{ satoshiClient }}>
            {children}
        </SecuredFinanceContext.Provider>
    );
};
