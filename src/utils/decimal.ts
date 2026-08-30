import { Decimal } from '@secured-finance/stablecoin-lib-base';

export const truncateDecimal = (value: Decimal, precision = 2): Decimal => {
    const factor = Decimal.from(10).pow(precision);
    const multiplied = value.mul(factor);
    const flooredString = multiplied.toString(0);
    const flooredDecimal = Decimal.from(flooredString);
    return flooredDecimal.div(factor);
};

const NUMERIC_INPUT_PATTERN = /^\d*(\.\d{0,2})?$/;

/**
 * Normalizes what a user typed or pasted into an amount field. Keeps at most two
 * decimal places, flooring rather than rounding so a value can never grow past
 * what was entered. A paste is just a large change event, so this covers it too.
 * Falls back to the previous value when the result is not a valid amount.
 */
export const sanitizeNumericInput = (next: string, prev: string): string => {
    const withoutSeparators = next.replace(/,/g, '');

    if (withoutSeparators === '') {
        return '';
    }

    // Drop anything that is not a digit or a decimal point, and keep only the
    // first decimal point so "12.3.4" collapses instead of being rejected.
    let seenDot = false;
    let cleaned = '';
    for (const char of withoutSeparators) {
        if (char >= '0' && char <= '9') {
            cleaned += char;
        } else if (char === '.' && !seenDot) {
            seenDot = true;
            cleaned += char;
        }
    }

    if (cleaned === '' || cleaned === '.') {
        return cleaned === '.' ? '0.' : prev;
    }

    const [integerPart, fractionPart] = cleaned.split('.');

    // "007" -> "7", but "0" and "0.x" keep their single leading zero.
    const normalizedInteger =
        integerPart.replace(/^0+(?=\d)/, '') || (seenDot ? '0' : '');

    const result = seenDot
        ? `${normalizedInteger}.${(fractionPart ?? '').slice(0, 2)}`
        : normalizedInteger;

    return NUMERIC_INPUT_PATTERN.test(result) ? result : prev;
};

/**
 * Formats an amount for display while the field is not focused: adds thousand
 * separators without ever padding or rounding, so the value reads back exactly
 * as it was entered. Operates on the string because Decimal.prettify rounds and
 * pads, and Number() would corrupt the full precision value written by "Max".
 */
export const formatNumericDisplay = (raw: string): string => {
    const value = raw.replace(/,/g, '');

    if (value === '' || value === '.') {
        return '';
    }

    const [integerPart, fractionPart] = value.split('.');
    const groupedInteger = (integerPart || '0').replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
    );

    // A trailing "." is valid mid-edit but should not linger once focus leaves.
    return fractionPart ? `${groupedInteger}.${fractionPart}` : groupedInteger;
};
