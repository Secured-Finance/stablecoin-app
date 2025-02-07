import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React, { useEffect } from 'react';
import { Button } from 'src/components/atoms';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { Spinner } from 'theme-ui';
import { Transaction, useMyTransactionState } from './Transaction';
import { useTroveView } from './Trove/context/TroveViewContext';

const select = ({ collateralSurplusBalance }: SfStablecoinStoreState) => ({
    collateralSurplusBalance,
});

export const CollateralSurplusAction: React.FC = () => {
    const { collateralSurplusBalance } = useSfStablecoinSelector(select);
    const {
        sfStablecoin: { send: sfStablecoin },
    } = useSfStablecoin();

    const myTransactionId = 'claim-coll-surplus';
    const myTransactionState = useMyTransactionState(myTransactionId);

    const { dispatchEvent } = useTroveView();

    useEffect(() => {
        if (myTransactionState.type === 'confirmedOneShot') {
            dispatchEvent('TROVE_SURPLUS_COLLATERAL_CLAIMED');
        }
    }, [myTransactionState.type, dispatchEvent]);

    return myTransactionState.type === 'waitingForApproval' ? (
        <div className='flex justify-end gap-2'>
            <Button disabled>
                <Spinner
                    sx={{ mr: 2, color: 'white' }}
                    size={20}
                    className='inline-block'
                />
                Waiting for your approval
            </Button>
        </div>
    ) : myTransactionState.type !== 'waitingForConfirmation' &&
      myTransactionState.type !== 'confirmed' ? (
        <div className='flex justify-end gap-2'>
            <Transaction
                id={myTransactionId}
                send={sfStablecoin.claimCollateralSurplus.bind(
                    sfStablecoin,
                    undefined
                )}
            >
                <Button>
                    Claim {collateralSurplusBalance.prettify()} tFIL
                </Button>
            </Transaction>
        </div>
    ) : null;
};
