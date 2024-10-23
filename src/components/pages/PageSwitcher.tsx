import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import { useEffect, useState } from 'react';
import {
    Dashboard,
    FrontendRegistration,
    FrontendRegistrationSuccess,
    UnregisteredFrontend,
} from 'src/components/pages';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';

const selectFrontend = ({ frontend }: SfStablecoinStoreState) => frontend;

export const PageSwitcher: React.FC = () => {
    const {
        account,
        config: { frontendTag },
    } = useSfStablecoin();

    const frontend = useSfStablecoinSelector(selectFrontend);
    const unregistered =
        frontendTag !== AddressZero && frontend.status === 'unregistered';

    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        if (unregistered) {
            setRegistering(true);
        }
    }, [unregistered]);

    if (registering || unregistered) {
        if (frontend.status === 'registered') {
            return (
                <FrontendRegistrationSuccess
                    onDismiss={() => setRegistering(false)}
                />
            );
        } else if (account === frontendTag) {
            return <FrontendRegistration />;
        } else {
            return <UnregisteredFrontend />;
        }
    } else {
        return <Dashboard />;
    }
};
