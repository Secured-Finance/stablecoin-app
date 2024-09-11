import { ManageStabilityPool } from 'src/components/organisms';
import { Page } from 'src/components/templates';
import { CurrencySymbol } from 'src/utils';

export const Earn = () => {
    const currency = CurrencySymbol.sfUSD;

    return (
        <Page name='earn'>
            <ManageStabilityPool currency={currency} />
        </Page>
    );
};
