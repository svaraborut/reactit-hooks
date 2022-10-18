import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A useState() hook that also exposes a function to reset the value
 * back to the default one. If the default value is provided as a function
 * the most recent function instance will be called to generate the value.
 */

export function useDefault<D>(defaultState: D, initialState: D | (() => D)): [D, Dispatch<SetStateAction<D>>]
export function useDefault<D = undefined>(defaultState: D): [D | undefined, Dispatch<SetStateAction<D | undefined>>]

export function useDefault<D>(defaultState: D, initialState?: D | (() => D)): [D, Dispatch<SetStateAction<D>>] {

    const [state, setState] = useState<D>(initialState!);

    return [
        (state === undefined || state === null) ? defaultState : state,
        setState,
    ];
}
