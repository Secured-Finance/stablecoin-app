import {
    TransactionReceipt,
    TransactionResponse,
} from '@ethersproject/abstract-provider';
import { LiquityReceipt, SentLiquityTransaction } from '@liquity/lib-base';
import { EthersTransactionOverrides } from '@liquity/lib-ethers';
import { createContext, useCallback, useContext, useState } from 'react';

type TransactionIdle = {
    type: 'idle';
};

type TransactionFailed = {
    type: 'failed';
    id: string;
    error: Error;
};

type TransactionWaitingForApproval = {
    type: 'waitingForApproval';
    id: string;
};

type TransactionCancelled = {
    type: 'cancelled';
    id: string;
};

type TransactionWaitingForConfirmations = {
    type: 'waitingForConfirmation';
    id: string;
    tx: SentTransaction;
};

type TransactionConfirmed = {
    type: 'confirmed';
    id: string;
};

type TransactionConfirmedOneShot = {
    type: 'confirmedOneShot';
    id: string;
};

export type TransactionState =
    | TransactionIdle
    | TransactionFailed
    | TransactionWaitingForApproval
    | TransactionCancelled
    | TransactionWaitingForConfirmations
    | TransactionConfirmed
    | TransactionConfirmedOneShot;

type SentTransaction = SentLiquityTransaction<
    TransactionResponse,
    LiquityReceipt<TransactionReceipt>
>;

export type TransactionFunction = (
    overrides?: EthersTransactionOverrides
) => Promise<SentTransaction>;

const hasMessage = (error: unknown): error is { message: string } =>
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string';

const useTransactionState = () => {
    const transactionState = useContext(TransactionContext);

    if (!transactionState) {
        throw new Error(
            'You must provide a TransactionContext via TransactionProvider'
        );
    }

    return transactionState;
};

const TransactionContext = createContext<
    [TransactionState, (state: TransactionState) => void] | undefined
>(undefined);

export const TransactionProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const transactionState = useState<TransactionState>({ type: 'idle' });

    return (
        <TransactionContext.Provider value={transactionState}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactionFunction = (
    id: string,
    send: TransactionFunction
): [
    sendTransaction: () => Promise<void>,
    transactionState: TransactionState
] => {
    const [transactionState, setTransactionState] = useTransactionState();

    const sendTransaction = useCallback(async () => {
        setTransactionState({ type: 'waitingForApproval', id });

        try {
            const tx = await send();

            setTransactionState({
                type: 'waitingForConfirmation',
                id,
                tx,
            });
        } catch (error) {
            if (
                hasMessage(error) &&
                error.message.includes('User denied transaction signature')
            ) {
                setTransactionState({ type: 'cancelled', id });
            } else {
                console.error(error);

                setTransactionState({
                    type: 'failed',
                    id,
                    error: new Error('Failed to send transaction (try again)'),
                });
            }
        }
    }, [send, id, setTransactionState]);

    return [sendTransaction, transactionState];
};
