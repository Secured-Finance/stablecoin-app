/* eslint-disable no-console */
import {
    SfStablecoinStoreState,
    StabilityDeposit,
} from '@secured-finance/stablecoin-lib-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSfStablecoinSelector } from 'src/hooks';
import { StabilityViewContext } from './StabilityViewContext';
import type { StabilityEvent, StabilityView } from './types';

type StabilityEventTransitions = Record<
    StabilityView,
    Partial<Record<StabilityEvent, StabilityView>>
>;

const transitions: StabilityEventTransitions = {
    NONE: {
        DEPOSIT_PRESSED: 'DEPOSITING',
    },
    DEPOSITING: {
        CANCEL_PRESSED: 'NONE',
        DEPOSIT_CONFIRMED: 'ACTIVE',
    },
    ACTIVE: {
        REWARDS_CLAIMED: 'ACTIVE',
        ADJUST_DEPOSIT_PRESSED: 'ADJUSTING',
        DEPOSIT_EMPTIED: 'NONE',
    },
    ADJUSTING: {
        CANCEL_PRESSED: 'ACTIVE',
        DEPOSIT_CONFIRMED: 'ACTIVE',
        DEPOSIT_EMPTIED: 'NONE',
    },
};

const transition = (
    view: StabilityView,
    event: StabilityEvent
): StabilityView => {
    const nextView = transitions[view][event] ?? view;
    return nextView;
};

const getInitialView = (stabilityDeposit: StabilityDeposit): StabilityView => {
    return stabilityDeposit.isEmpty ? 'NONE' : 'ACTIVE';
};

const select = ({
    stabilityDeposit,
}: SfStablecoinStoreState): StabilityDeposit => stabilityDeposit;

export const StabilityViewProvider: React.FC<
    React.PropsWithChildren
> = props => {
    const { children } = props;
    const stabilityDeposit = useSfStablecoinSelector(select);

    const [view, setView] = useState<StabilityView>(
        getInitialView(stabilityDeposit)
    );
    const viewRef = useRef<StabilityView>(view);

    const dispatchEvent = useCallback((event: StabilityEvent) => {
        const nextView = transition(viewRef.current, event);

        console.log(
            'dispatchEvent() [current-view, event, next-view]',
            viewRef.current,
            event,
            nextView
        );
        setView(nextView);
    }, []);

    useEffect(() => {
        viewRef.current = view;
    }, [view]);

    useEffect(() => {
        if (stabilityDeposit.isEmpty) {
            dispatchEvent('DEPOSIT_EMPTIED');
        }
    }, [stabilityDeposit.isEmpty, dispatchEvent]);

    const provider = {
        view,
        dispatchEvent,
    };

    return (
        <StabilityViewContext.Provider value={provider}>
            {children}
        </StabilityViewContext.Provider>
    );
};
