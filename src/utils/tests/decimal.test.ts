import { formatNumericDisplay, sanitizeNumericInput } from '../decimal';

describe('sanitizeNumericInput', () => {
    it('caps entry at two decimal places by flooring', () => {
        expect(sanitizeNumericInput('123.456', '123.45')).toBe('123.45');
        expect(sanitizeNumericInput('123.459', '123.45')).toBe('123.45');
    });

    it('leaves values with two or fewer decimals untouched', () => {
        expect(sanitizeNumericInput('100', '')).toBe('100');
        expect(sanitizeNumericInput('100.1', '100')).toBe('100.1');
        expect(sanitizeNumericInput('100.12', '100.1')).toBe('100.12');
    });

    it('allows a trailing decimal point while typing', () => {
        expect(sanitizeNumericInput('100.', '100')).toBe('100.');
    });

    it('normalizes a leading decimal point', () => {
        expect(sanitizeNumericInput('.5', '')).toBe('0.5');
        expect(sanitizeNumericInput('.', '')).toBe('0.');
    });

    it('accepts a pasted value with separators and extra precision', () => {
        expect(sanitizeNumericInput('1,234.5678', '')).toBe('1234.56');
    });

    it('collapses a second decimal point instead of rejecting the value', () => {
        expect(sanitizeNumericInput('12.3.4', '12.3')).toBe('12.34');
    });

    it('strips redundant leading zeros', () => {
        expect(sanitizeNumericInput('007', '0')).toBe('7');
        expect(sanitizeNumericInput('0', '')).toBe('0');
        expect(sanitizeNumericInput('0.5', '0')).toBe('0.5');
    });

    it('falls back to the previous value for non numeric input', () => {
        expect(sanitizeNumericInput('abc', '12.34')).toBe('12.34');
    });

    it('allows the field to be cleared', () => {
        expect(sanitizeNumericInput('', '12.34')).toBe('');
    });
});

describe('formatNumericDisplay', () => {
    it('groups thousands without padding or rounding', () => {
        expect(formatNumericDisplay('1234.5')).toBe('1,234.5');
        expect(formatNumericDisplay('1234567.89')).toBe('1,234,567.89');
    });

    it('never pads an integer with decimal places', () => {
        expect(formatNumericDisplay('100')).toBe('100');
    });

    it('preserves the entered precision exactly', () => {
        expect(formatNumericDisplay('100.1')).toBe('100.1');
        expect(formatNumericDisplay('100.10')).toBe('100.10');
    });

    it('keeps the full precision written by Max', () => {
        expect(formatNumericDisplay('100567.891234567891')).toBe(
            '100,567.891234567891'
        );
    });

    it('drops a trailing decimal point once focus leaves', () => {
        expect(formatNumericDisplay('100.')).toBe('100');
    });

    it('returns an empty string so the placeholder shows through', () => {
        expect(formatNumericDisplay('')).toBe('');
        expect(formatNumericDisplay('.')).toBe('');
    });
});
