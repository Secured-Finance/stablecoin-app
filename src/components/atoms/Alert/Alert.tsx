import clsx from 'clsx';
import AlertIcon from 'src/assets/icons/alert-fill.svg';
import InfoIconFill from 'src/assets/icons/information-circle-fill.svg';
import { AlertColors } from './types';

const BORDER_STYLES: Record<AlertColors, string> = {
    ['error']: 'border-error-300 bg-error-500/10',
    ['warning']: 'border-warning-300 bg-warning-500/10',
    ['info']: 'border-primary-300 bg-primary-500/10',
};
const ICON_STYLES = {
    ['error']: 'fill-error-700 text-error-700',
    ['warning']: 'fill-warning-700 text-warning-700',
    ['info']: 'fill-primary-700 text-primary-700',
};

type AlertProps = React.PropsWithChildren<{
    color?: AlertColors;
}>;

export const Alert: React.FC<AlertProps> = ({ color = 'error', children }) => {
    return (
        <div
            className={clsx(
                'typography-desktop-body-5 flex min-h-10 items-center gap-2 rounded-md border px-2.5 py-1.5 text-neutral-900',
                BORDER_STYLES[color]
            )}
        >
            {color === 'info' ? (
                <InfoIconFill
                    className={clsx(
                        'h-4 w-4 flex-shrink-0 fill-current',
                        ICON_STYLES[color]
                    )}
                    role='img'
                />
            ) : (
                <AlertIcon
                    className={clsx(
                        'h-4 w-4 flex-shrink-0 fill-current',
                        ICON_STYLES[color]
                    )}
                    role='img'
                />
            )}
            <span>{children}</span>
        </div>
    );
};
