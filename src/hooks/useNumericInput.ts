import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { formatNumericDisplay, sanitizeNumericInput } from 'src/utils';

type UseNumericInputArgs = {
    /** Current value owned by the parent. May carry full precision from "Max". */
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
};

/**
 * Shared behavior for every amount field in the app.
 *
 * Entry is capped at two decimal places, the value is shown exactly as entered
 * (grouped with separators while unfocused, raw while editing) and the caret is
 * left alone so it lands wherever the user clicked or tapped.
 */
export const useNumericInput = ({
    value,
    onChange,
    onFocus,
    onBlur,
}: UseNumericInputArgs) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [raw, setRaw] = useState(() => value?.replace(/,/g, '') ?? '');
    const caretRef = useRef<number | null>(null);

    // The parent owns the value; adopt it whenever the user is not mid edit so
    // that "Max" and store updates land without fighting the keyboard.
    useEffect(() => {
        if (!isFocused) {
            setRaw(value?.replace(/,/g, '') ?? '');
        }
    }, [value, isFocused]);

    // Only runs when sanitizing dropped characters, which would otherwise leave
    // the caret at the end of the field after React re-renders.
    useLayoutEffect(() => {
        if (caretRef.current !== null && inputRef.current) {
            const caret = caretRef.current;
            caretRef.current = null;
            inputRef.current.setSelectionRange(caret, caret);
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const typed = event.target.value;
        const clean = sanitizeNumericInput(typed, raw);

        if (clean !== typed) {
            const selection = event.target.selectionStart ?? typed.length;
            caretRef.current = Math.max(
                0,
                selection - (typed.length - clean.length)
            );
        }

        setRaw(clean);
        onChange(clean);
    };

    const handleFocus = () => {
        // Deliberately does not touch the value or the selection: the browser
        // places the caret from the click, and moving it here is what made the
        // cursor jump to the end of the field.
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);

        // "100." is valid mid edit but should not persist into parent state.
        if (raw.endsWith('.')) {
            const normalized = raw.slice(0, -1);
            setRaw(normalized);
            onChange(normalized);
        }

        onBlur?.();
    };

    return {
        inputRef,
        /** Spread onto the <input>. */
        inputProps: {
            ref: inputRef,
            type: 'text' as const,
            inputMode: 'decimal' as const,
            step: 'any',
            value: isFocused ? raw : formatNumericDisplay(raw),
            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
        },
    };
};
