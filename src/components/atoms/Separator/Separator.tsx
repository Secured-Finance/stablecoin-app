import clsx from 'clsx';

interface SeparatorProps {
    color?: 'neutral-100' | 'default';
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
                    'border-neutral-100': color === 'neutral-100',
                    'border-white-5': color === 'default',
                }
            )}
            data-testid={'separator'}
        />
    );
};
