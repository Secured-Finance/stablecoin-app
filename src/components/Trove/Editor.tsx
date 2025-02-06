import clsx from 'clsx';
import React from 'react';
import ArrowRight from 'src/assets/icons/arrow-right.svg';
import { Button, ButtonSizes } from 'src/components/atoms';
import { Flex, Input, SxProp, ThemeUICSSProperties } from 'theme-ui';
import { Icon } from '../Icon';

type RowProps = SxProp &
    React.PropsWithChildren<{
        label: string | React.ReactNode;
        labelId?: string;
        labelFor?: string;
        infoIcon?: React.ReactNode;
    }>;

export const Row: React.FC<RowProps> = ({
    label,
    labelId,
    labelFor,
    children,
    infoIcon,
}) => {
    return (
        <div className='flex flex-col gap-0.5 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2'>
            <label
                id={labelId}
                htmlFor={labelFor}
                className='typography-desktop-body-5 text-neutral-600'
            >
                {label}
                {infoIcon && infoIcon}
            </label>
            {children}
        </div>
    );
};

type PendingAmountProps = {
    value: string;
    color?: string;
};

const PendingAmount: React.FC<PendingAmountProps> = ({ color, value }) => (
    <div className={clsx('typography-desktop-body-5', color)}>
        (
        {value === '++' ? (
            <Icon name='angle-double-up' />
        ) : value === '--' ? (
            <Icon name='angle-double-down' />
        ) : value?.startsWith('+') ? (
            <>
                <Icon name='angle-up' /> {value.substr(1)}
            </>
        ) : value?.startsWith('-') ? (
            <>
                <Icon name='angle-down' /> {value.substr(1)}
            </>
        ) : (
            value
        )}
        )
    </div>
);

type StaticAmountsProps = React.PropsWithChildren<{
    inputId?: string;
    labelledBy?: string;
    amount?: string;
    unit?: string;
    color?: string;
    pendingAmount?: string;
    pendingColor?: string;
    onClick?: () => void;
}>;

export const StaticAmounts: React.FC<StaticAmountsProps & SxProp> = ({
    inputId,
    labelledBy,
    amount,
    unit,
    color,
    pendingAmount,
    pendingColor,
    onClick,
    children,
}) => {
    return (
        <button
            id={inputId}
            aria-labelledby={labelledBy}
            onClick={onClick}
            className={clsx(
                'flex items-center justify-between',
                onClick ? 'cursor-text' : ''
            )}
        >
            {amount && (
                <Flex sx={{ alignItems: 'center' }}>
                    <span className='typography-desktop-body-2'>
                        <span className={clsx('font-semibold', color)}>
                            {amount}
                        </span>{' '}
                        {unit ?? unit}
                    </span>

                    {pendingAmount && (
                        <>
                            &nbsp;
                            <PendingAmount
                                color={pendingColor}
                                value={pendingAmount}
                            />
                        </>
                    )}
                </Flex>
            )}

            {children}
        </button>
    );
};

const editableStyle: ThemeUICSSProperties = {
    flexGrow: 1,

    mb: [2, 3],
    pl: 3,
    pr: '11px',
    pb: 2,
    pt: '28px',

    boxShadow: [1, 2],
    border: 1,
    borderColor: 'muted',
    backgroundColor: 'transparent',
};

type StaticRowProps = RowProps & StaticAmountsProps;

export const StaticRow: React.FC<StaticRowProps> = ({
    label,
    labelId,
    labelFor,
    infoIcon,
    amount,
    children,
    ...props
}) => {
    return (
        <div className='flex flex-col'>
            {label && (
                <label
                    id={labelId}
                    htmlFor={labelFor}
                    className='typography-desktop-body-5 relative flex items-center gap-1 text-neutral-900'
                >
                    {label} {infoIcon && infoIcon}
                </label>
            )}
            {amount ? (
                <StaticAmounts amount={amount} {...props}>
                    {children}
                </StaticAmounts>
            ) : (
                children
            )}
        </div>
    );
};

type DisabledEditableRowProps = Omit<
    StaticAmountsProps,
    'labelledBy' | 'onClick'
> & {
    label: string;
};

export const DisabledEditableAmounts: React.FC<StaticAmountsProps & SxProp> = ({
    inputId,
    children,
    sx,
    ...props
}) => (
    <StaticAmounts
        sx={{ ...editableStyle, boxShadow: 0, ...sx }}
        labelledBy={`${inputId}-label`}
        inputId={inputId}
        {...props}
    >
        {children}
    </StaticAmounts>
);

export const DisabledEditableRow: React.FC<DisabledEditableRowProps> = ({
    inputId,
    label,
    amount,
    children,
    ...props
}) => (
    <Row labelId={`${inputId}-label`} label={label}>
        {amount ? (
            <DisabledEditableAmounts
                inputId={inputId}
                amount={amount}
                {...props}
            >
                {children}
            </DisabledEditableAmounts>
        ) : (
            children
        )}
    </Row>
);

type EditableRowProps = DisabledEditableRowProps & {
    editingState: [string | undefined, (editing: string | undefined) => void];
    editedAmount: string;
    setEditedAmount: (editedAmount: string) => void;
    maxAmount?: string;
    maxedOut?: boolean;
};

export const EditableRow: React.FC<EditableRowProps> = ({
    label,
    inputId,
    unit,
    amount,
    color,
    pendingAmount,
    pendingColor,
    editingState,
    editedAmount,
    setEditedAmount,
    maxAmount,
    maxedOut,
}) => {
    const [editing, setEditing] = editingState;
    // const [invalid, setInvalid] = useState(false);

    return editing === inputId ? (
        <Row {...{ label, labelFor: inputId, unit }}>
            <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                id={inputId}
                type='number'
                step='any'
                defaultValue={editedAmount}
                onChange={e => {
                    try {
                        setEditedAmount(e.target.value);
                        // setInvalid(false);
                    } catch {
                        // setInvalid(true);
                    }
                }}
                onBlur={() => {
                    setEditing(undefined);
                    // setInvalid(false);
                }}
                variant='editor'
                className=''
            />
        </Row>
    ) : (
        <Row labelId={`${inputId}-label`} {...{ label, unit }}>
            <StaticAmounts
                labelledBy={`${inputId}-label`}
                onClick={() => setEditing(inputId)}
                inputId={inputId}
                amount={amount}
                unit={unit}
                color={color}
                pendingAmount={pendingAmount}
                pendingColor={pendingColor}
            >
                {maxAmount && (
                    <Button
                        size={ButtonSizes.sm}
                        onClick={event => {
                            setEditedAmount(maxAmount);
                            event.stopPropagation();
                        }}
                        disabled={maxedOut}
                    >
                        Max
                    </Button>
                )}
            </StaticAmounts>
        </Row>
    );
};

type AmountChangeProps = {
    from: string;
    to: string;
    unit?: string;
};

export const AmountChange: React.FC<AmountChangeProps> = ({
    from,
    to,
    unit,
}) => {
    return (
        <Flex sx={{ alignItems: 'center' }}>
            <span className='typography-desktop-body-2 flex items-center'>
                {from}
                <ArrowRight className='inline h-5 w-5 text-neutral-600' />
                <span
                    className={clsx(
                        'font-semibold',
                        Number(to) !== 0 ? 'text-error-700' : ''
                    )}
                >
                    {to}
                </span>
                &nbsp;
                {unit ?? unit}
            </span>
        </Flex>
    );
};
