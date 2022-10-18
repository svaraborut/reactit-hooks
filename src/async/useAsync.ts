import { useCallback, useRef, useState } from 'react';
import { PromiseFn } from './types';
import { usePromise } from './usePromise';

/**
 * An asynchronous wrapping function, that enables use of async functions within
 * React functional components. This hook handles the entire lifecycle of a promise.
 *
 * (?) When the promise is executing, calling it again will result in the previous
 *     execution being ignored. Eg.: the last call to run / runAsync will always be
 *     the one that is affecting the state.
 */

export interface UseAsyncState<Res, Err> {
    isLoading: boolean
    isCompleted: boolean
    isSucceeded: boolean
    isFailed: boolean
    result?: Res
    error?: Err
}

export interface UseAsyncReturn<Args extends any[] = [], Res = void, Err = any> extends UseAsyncState<Res, Err>{
    run: (...args: Args) => void
    runAsync: PromiseFn<Args, Res>
}

export function useAsync<Args extends any[] = [], Res = void, Err = any>(
    fn: PromiseFn<Args, Res>,
): UseAsyncReturn<Args, Res, Err> {

    // Unique call id to handle concurrency
    const callIdRef = useRef(0)

    // Inner state
    const [state, setState] = useState<UseAsyncState<Res, Err>>({
        isLoading: false,
        isCompleted: false,
        isSucceeded: false,
        isFailed: false,
    });

    const runAsync = useCallback<PromiseFn<Args, Res>>(async (...args: Args) => {
        const callId = ++callIdRef.current

        setState({ isLoading: true, isCompleted: false, isSucceeded: false, isFailed: false })
        try {
            // Execute
            const result = await fn(...args)
            if (callIdRef.current === callId) {
                setState({ isLoading: false, isCompleted: true, isSucceeded: true, isFailed: false, result })
            }
            return result
        } catch (error) {
            if (callIdRef.current === callId) {
                setState({ isLoading: false, isCompleted: true, isSucceeded: false, isFailed: true, error })
            }
            throw error
        }

    }, [])

    const run = usePromise(runAsync)

    return {
        ...state,
        runAsync,
        run,
    };
}
