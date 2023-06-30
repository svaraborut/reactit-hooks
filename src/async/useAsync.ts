import { useCallback, useRef } from 'react';
import { PromiseFn } from './types';
import { usePromise } from './usePromise';
import { useLatest } from '../generic/useLatest';
import { useReset } from '../state/useReset';

/**
 * An asynchronous wrapping function, that enables use of async functions within
 * React functional components. This hook handles the entire lifecycle of a promise.
 *
 * (?) When the promise is executing, calling it again will result in the previous
 *     execution being ignored. Eg.: the last call to run / runAsync will always be
 *     the one that is affecting the state.
 *
 * (*) Task will hold a reference to the original calling arguments
 */

export interface UseAsyncState<Res, Args extends any[], Err> {
    isLoading: boolean
    isCompleted: boolean
    isSucceed: boolean
    isFailed: boolean
    args?: Args
    result?: Res
    error?: Err
}

export interface UseAsyncReturn<Res = void, Args extends any[] = [], Err = any> extends UseAsyncState<Res, Args, Err>{
    run: (...args: Args) => void
    runAsync: PromiseFn<Args, Res>
    reset: () => void
}

export function useAsync<Res = void, Args extends any[] = [], Err = any>(
    fn: PromiseFn<Args, Res>,
): UseAsyncReturn<Res, Args, Err> {

    const lastFn = useLatest(fn)

    // Unique call id to handle concurrency
    const callIdRef = useRef(0)

    // Inner state
    const [state, setState, reset] = useReset<UseAsyncState<Res, Args, Err>>({
        isLoading: false,
        isCompleted: false,
        isSucceed: false,
        isFailed: false,
    });

    const runAsync = useCallback<PromiseFn<Args, Res>>(async (...args: Args) => {
        const callId = ++callIdRef.current

        setState({ isLoading: true, isCompleted: false, isSucceed: false, isFailed: false, args })
        try {
            // Execute
            const result = await lastFn.current(...args)
            if (callIdRef.current === callId) {
                setState({ isLoading: false, isCompleted: true, isSucceed: true, isFailed: false, args, result })
            }
            return result
        } catch (error) {
            if (callIdRef.current === callId) {
                setState({ isLoading: false, isCompleted: true, isSucceed: false, isFailed: true, args, error })
            }
            throw error
        }

    }, [])

    const run = usePromise(runAsync)

    return {
        ...state,
        runAsync,
        run,
        reset,
    };
}
