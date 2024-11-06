import clsx from 'clsx';
// import {
//     buildStyles,
//     CircularProgressbarWithChildren,
// } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Check from 'src/assets/icons/check.svg';
import Cog from 'src/assets/icons/cog.svg';
import Cross from 'src/assets/icons/x.svg';
import type { TransactionState } from './Transaction';

// const strokeWidth = 10;

// const circularProgressbarStyle = {
//     strokeLinecap: 'butt',
//     pathColor: 'white',
//     trailColor: 'rgba(255, 255, 255, 0.33)',
// };

// const slowProgress = {
//     strokeWidth,
//     styles: buildStyles({
//         ...circularProgressbarStyle,
//         pathTransitionDuration: 30,
//     }),
// };

// const fastProgress = {
//     strokeWidth,
//     styles: buildStyles({
//         ...circularProgressbarStyle,
//         pathTransitionDuration: 0.75,
//     }),
// };

const iconClassName = 'h-6 w-6 laptop:h-8 laptop:w-8';

export type TransactionStateType = TransactionState['type'];

// const Donut = memo(
//     CircularProgressbarWithChildren,
//     ({ value: prev }, { value: next }) => prev === next
// );

type TransactionProgressDonutProps = {
    state: TransactionStateType;
};

const TransactionProgressDonut: React.FC<TransactionProgressDonutProps> = ({
    state,
}) => {
    // const [value, setValue] = useState(0);
    // const maxValue = 1;

    // useEffect(() => {
    //     if (state === 'confirmed') {
    //         setTimeout(() => setValue(maxValue), 40);
    //     } else {
    //         setTimeout(() => setValue(maxValue * 0.67), 20);
    //     }
    // }, [state]);

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
                }
            )}
        >
            <TransactionProgressDonut state={state} />

            <p className='typography-desktop-body-4 laptop:typography-desktop-body-3 font-semibold text-neutral-700'>
                {state === 'waitingForConfirmation'
                    ? 'Transaction is pending... Please wait.'
                    : state === 'cancelled'
                    ? 'Cancelled'
                    : state === 'failed'
                    ? message || 'Transaction failed. Please try again.'
                    : 'Confirmed'}
            </p>
        </div>
    );
};
