import clsx from 'clsx';

interface SeparatorProps {
    color?: 'neutral-700' | 'default';
    orientation?: 'horizontal' | 'vertical';
}

export const Separator = ({
    color = 'default',
    orientation = 'horizontal',
}: SeparatorProps) => {
    return (
        <div
            className={clsx(
                {
                    'border-b': orientation === 'horizontal',
                    'border-l': orientation === 'vertical',
                },
                {
                    'border-neutral-700': color === 'neutral-700',
                    'border-white-5': color === 'default',
                }
            )}
            data-testid={'separator'}
        />
    );
};
