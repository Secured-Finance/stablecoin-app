import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { useEffect, useState } from 'react';
import {
    Dashboard,
    FrontendRegistration,
    FrontendRegistrationSuccess,
    UnregisteredFrontend,
} from 'src/components/pages';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Page } from '../templates';

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

    let component;

    if (registering || unregistered) {
        if (frontend.status === 'registered') {
            component = (
                <FrontendRegistrationSuccess
                    onDismiss={() => setRegistering(false)}
                />
            );
        } else if (account === frontendTag) {
            component = <FrontendRegistration />;
        } else {
            component = <UnregisteredFrontend />;
        }
    } else {
        component = <Dashboard />;
    }

    return <Page name='page-switcher'>{component}</Page>;
};
