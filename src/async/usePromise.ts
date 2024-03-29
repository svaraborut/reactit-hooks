import { useCallback } from 'react';
import { DispatchFn, PromiseFn } from './types';
import { useLatest } from '../generic/useLatest';

/**
 * Wraps an async function and returns a plain function to be used inside sync functions
 * and component callbacks, any exceptions will catch and console.debug() for
 * development purposes.
 *
 * (!) Remember to enable Verbose Debug Levels to see this log
 *
 * (?) The returned function is stable
 *
 * /B 2022-10-19
 */
export function usePromise<Res, Args extends any[] = []>(fn: PromiseFn<Args, Res>): DispatchFn<Args> {

    const lastFn = useLatest(fn)

    return useCallback((...args: Args) => {
        lastFn.current.apply(undefined, args).catch((error: any) => {
            console.debug(`usePromise collected an error ${fn.name}`, error)
        })
    }, [])

}
