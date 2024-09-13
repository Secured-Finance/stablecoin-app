import { useRouter } from 'next/router';
import { ManageStabilityPool } from 'src/components/organisms';
import { Page } from 'src/components/templates';
import { toCurrencySymbol } from 'src/utils';

function ManageSP() {
    const router = useRouter();
    const currency = toCurrencySymbol(router.query.currency as string);

    if (!currency) {
        return null;
    }

    return (
        <Page name={`earn-${currency}`}>
            <ManageStabilityPool currency={currency} />
        </Page>
    );
}

export default ManageSP;
