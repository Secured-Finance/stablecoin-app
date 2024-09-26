import React from 'react';
import type { WizardProviderProps } from './Context';
import { WizardProvider } from './Context';

export const Wizard: React.FC<WizardProviderProps> = ({
    children,
    onFinish,
    onCancel,
}) => {
    return (
        <WizardProvider onFinish={onFinish} onCancel={onCancel}>
            {children}
        </WizardProvider>
    );
};
