import { Wallet } from '@ethersproject/wallet';
import { Decimal, Difference, Trove } from '@liquity/lib-base';
import { useLiquity } from 'src/hooks/useLiquity';
import { LiquityStoreProvider } from './LiquityStoreProvider';

type LiquityFrontendProps = React.PropsWithChildren<{
    loader?: React.ReactNode;
}>;

export const LiquityFrontendProvider: React.FC<LiquityFrontendProps> = ({
    children,
    loader,
}) => {
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
        <LiquityStoreProvider {...{ loader }} store={liquity.store}>
            {children}
        </LiquityStoreProvider>
    );
};
