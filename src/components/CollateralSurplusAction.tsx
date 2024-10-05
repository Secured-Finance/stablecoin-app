import { LiquityStoreState } from '@secured-finance/lib-base';
import React, { useEffect } from 'react';
import { useLiquity, useLiquitySelector } from 'src/hooks';
import { Button, Flex, Spinner } from 'theme-ui';
import { Transaction, useMyTransactionState } from './Transaction';
import { useTroveView } from './Trove/context/TroveViewContext';

const select = ({ collateralSurplusBalance }: LiquityStoreState) => ({
    collateralSurplusBalance,
});

export const CollateralSurplusAction: React.FC = () => {
    const { collateralSurplusBalance } = useLiquitySelector(select);
    const {
        liquity: { send: liquity },
    } = useLiquity();

    const myTransactionId = 'claim-coll-surplus';
    const myTransactionState = useMyTransactionState(myTransactionId);

    const { dispatchEvent } = useTroveView();

    useEffect(() => {
        if (myTransactionState.type === 'confirmedOneShot') {
            dispatchEvent('TROVE_SURPLUS_COLLATERAL_CLAIMED');
        }
    }, [myTransactionState.type, dispatchEvent]);

    return myTransactionState.type === 'waitingForApproval' ? (
        <Flex variant='layout.actions'>
            <Button disabled sx={{ mx: 2 }}>
                <Spinner sx={{ mr: 2, color: 'white' }} size={20} />
                Waiting for your approval
            </Button>
        </Flex>
    ) : myTransactionState.type !== 'waitingForConfirmation' &&
      myTransactionState.type !== 'confirmed' ? (
        <Flex variant='layout.actions'>
            <Transaction
                id={myTransactionId}
                send={liquity.claimCollateralSurplus.bind(liquity, undefined)}
            >
                <Button sx={{ mx: 2 }}>
                    Claim {collateralSurplusBalance.prettify()} tFIL
                </Button>
            </Transaction>
        </Flex>
    ) : null;
};
