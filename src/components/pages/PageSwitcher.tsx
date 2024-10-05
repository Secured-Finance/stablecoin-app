import { AddressZero } from '@ethersproject/constants';
import { useEffect, useState } from 'react';

import { useLiquitySelector } from '@liquity/lib-react';
import { LiquityStoreState } from '@secured-finance/lib-base';

import { useLiquity } from 'src/hooks/LiquityContext';

import { Container } from 'theme-ui';
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

    return (
        <Container
            variant='main'
            sx={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {component}
        </Container>
    );
};
