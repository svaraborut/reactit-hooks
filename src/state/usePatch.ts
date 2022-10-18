import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { resolveHookAction } from '../utils';

type PatchStateAction<D> = Partial<D> | ((prevState: D) => Partial<D>);

/**
 * A state for objects, that supports patching.
 */

export function usePatch<D>(
    initialState: D | (() => D)
): [D, Dispatch<SetStateAction<D>>, Dispatch<PatchStateAction<D>>]

export function usePatch<D = undefined>(
): [D | undefined, Dispatch<SetStateAction<D | undefined>>, Dispatch<PatchStateAction<D | undefined>>]

export function usePatch<D>(
    initialState?: D | (() => D)
): [D, Dispatch<SetStateAction<D>>, Dispatch<PatchStateAction<D>>] {

    const [state, setState] = useState<D>(initialState!);

    const patchState = useCallback(
        (action: PatchStateAction<D>) => {
            setState((prevState) => ({ ...prevState, ...(resolveHookAction(action, prevState)) }))
        },
        []
    )

    return [state, setState, patchState];
}
