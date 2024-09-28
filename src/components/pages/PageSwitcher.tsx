import { AddressZero } from '@ethersproject/constants';
import { useEffect, useState } from 'react';

import { LiquityStoreState } from '@liquity/lib-base';
import { useLiquitySelector } from '@liquity/lib-react';

import { useLiquity } from 'src/hooks/LiquityContext';

import { Page } from '../templates';
import { Dashboard } from './Dashboard';
import { FrontendRegistration } from './FrontendRegistration';
import { FrontendRegistrationSuccess } from './FrontendRegistrationSuccess';
import { UnregisteredFrontend } from './UnregisteredFrontend';

const selectFrontend = ({ frontend }: LiquityStoreState) => frontend;

export const PageSwitcher: React.FC = () => {
    const {
        account,
        config: { frontendTag },
    } = useLiquity();

    const frontend = useLiquitySelector(selectFrontend);
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

    return <Page name='dashboard'>{component}</Page>;
};
