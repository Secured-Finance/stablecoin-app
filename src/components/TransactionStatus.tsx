import clsx from 'clsx';
import { t } from 'i18next';
import 'react-circular-progressbar/dist/styles.css';
import Check from 'src/assets/icons/check.svg';
import Cog from 'src/assets/icons/cog.svg';
import Cross from 'src/assets/icons/x.svg';
import type { TransactionState } from './Transaction';

const iconClassName = 'h-6 w-6 laptop:h-8 laptop:w-8';

export type TransactionStateType = TransactionState['type'];

type TransactionProgressDonutProps = {
    state: TransactionStateType;
};

const TransactionProgressDonut: React.FC<TransactionProgressDonutProps> = ({
    state,
}) => {
    return state === 'confirmed' ? (
        <Check className={iconClassName} />
    ) : state === 'failed' || state === 'cancelled' ? (
        <Cross className={iconClassName} />
    ) : (
        <Cog className={clsx(iconClassName, 'animate-spin')} />
    );
};

type TransactionStatusProps = {
    state: TransactionStateType;
    message?: string;
};

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
    state,
    message,
}) => {
    if (state === 'idle' || state === 'waitingForApproval') {
        return null;
    }

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 flex w-full items-center gap-2 overflow-hidden px-5 py-4',
                {
                    'bg-[#D4FCD8]': state === 'confirmed',
                    'bg-warning-300': state === 'cancelled',
                    'bg-[#FFDAE0]': state === 'failed',
                    'bg-[#E8E9FD]':
                        state !== 'confirmed' &&
                        state !== 'cancelled' &&
                        state !== 'failed',
                }
            )}
        >
            <TransactionProgressDonut state={state} />

            <p className='typography-desktop-body-4 laptop:typography-desktop-body-3 font-semibold text-neutral-700'>
                {state === 'waitingForConfirmation'
                    ? t('common.transaction-pending')
                    : state === 'cancelled'
                    ? t('common.cancel')
                    : state === 'failed'
                    ? message || t('common.transaction-failed')
                    : t('common.confirmed')}
            </p>
        </div>
    );
};
