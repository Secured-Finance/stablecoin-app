import { Wallet } from '@ethersproject/wallet';
import { Decimal, Difference, Trove } from '@liquity/lib-base';
import { useLiquity } from 'src/hooks/useLiquity';
import { LiquityStoreProvider } from './LiquityStoreProvider';

export const LiquityFrontendProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { account, provider, liquity } = useLiquity();

    // For console tinkering ;-)
    Object.assign(window, {
        account,
        provider,
        liquity,
        Trove,
        Decimal,
        Difference,
        Wallet,
    });

    return (
        <LiquityStoreProvider store={liquity.store}>
            {children}
        </LiquityStoreProvider>
    );
};
