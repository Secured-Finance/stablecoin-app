import clsx from 'clsx';
import NumericFormat, {
    NumberFormatValues,
    SourceInfo,
} from 'react-number-format';

export type SizeDependentStylesConfig = Record<
    'shortText' | 'mediumText' | 'longText',
    { maxChar: number; styles: string }
>;

interface InputBaseProps {
    className?: string;
    value?: string;
    onValueChange: (v: string | undefined) => void;
    label?: string;
    placeHolder?: string;
    sizeDependentStyles?: SizeDependentStylesConfig;
}

export const InputBase = ({
    className,
    value,
    onValueChange,
    label,
    placeHolder,
    sizeDependentStyles,
}: InputBaseProps) => {
    const handleValueChange = (
        values: NumberFormatValues,
        _sourceInfo: SourceInfo
    ) => {
        let value = values.value;
        if (onValueChange) {
            value = value === '.' ? '0'.concat(value) : value;
            onValueChange(value);
        }
    };

    const fontSizeClass = sizeDependentStyles
        ? clsx({
              [sizeDependentStyles.shortText.styles]:
                  !value ||
                  (value &&
                      value.toString().length <=
                          sizeDependentStyles.shortText.maxChar),
              [sizeDependentStyles.mediumText.styles]:
                  value &&
                  value.toString().length >
                      sizeDependentStyles.shortText.maxChar &&
                  value.toString().length <=
                      sizeDependentStyles.mediumText.maxChar,
              [sizeDependentStyles.longText.styles]:
                  value &&
                  value.toString().length >
                      sizeDependentStyles.mediumText.maxChar &&
                  value.toString().length <=
                      sizeDependentStyles.longText.maxChar,
          })
        : null;

    return (
        <NumericFormat
            className={clsx(
                'w-full placeholder-opacity-50 focus:outline-none',
                className,
                fontSizeClass
            )}
            placeholder={placeHolder ?? '0'}
            thousandSeparator={true}
            allowNegative={false}
            value={value ?? ''}
            displayType='input'
            onValueChange={handleValueChange}
            aria-label={label}
            inputMode='decimal'
            allowLeadingZeros={false}
        />
    );
};
