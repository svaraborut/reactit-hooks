import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useLatest } from '../generic/useLatest';

export type ResetAction = () => void;

/**
 * A useState() hook that also exposes a function to reset the value
 * back to the default one. If the default value is provided as a function
 * the most recent function instance will be called to generate the value.
 */

export function useReset<D>(initialState: D | (() => D)): [D, Dispatch<SetStateAction<D>>, ResetAction];
export function useReset<D = undefined>(): [D | undefined, Dispatch<SetStateAction<D | undefined>>, ResetAction];

export function useReset<D>(initialState?: D | (() => D)): [D, Dispatch<SetStateAction<D>>, ResetAction] {

    const [state, setState] = useState<D>(initialState!);
    const latestState = useLatest(initialState);

    const resetState = useCallback(
        () => { setState(latestState.current!) },
        []
    )

    return [state, setState, resetState];
}
