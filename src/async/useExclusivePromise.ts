import { useCallback, useRef } from 'react';
import { PromiseFn, ConcurrencyError } from './types';
import { useLatest } from '../generic/useLatest';

/**
 * Wraps an async function such that only one call at-a-time may be in execution,
 * any attempt to call the promise while another execution is in progress
 * will result in the second call throwing an exception.
 *
 * (!) Promise should be stable, changing promise while a call is in progress
 * will not affect the outcome nor interrupt the execution.
 *
 * (?) Returned task is assured to be stable, an old result instance will
 * always call the most fresh task.
 *
 * /B 2022-10-19
 */
export function useExclusivePromise<Res, Args extends any[] = []>(fn: PromiseFn<Args, Res>): PromiseFn<Args, Res> {

    const lastFn = useLatest(fn)
    const isExecuting = useRef<boolean>(false)

    return useCallback(async (...args: Args): Promise<Res> => {
        if (isExecuting.current) {
            throw new ConcurrencyError(`Promise is already running`)
        } else {
            isExecuting.current = true
            const res = await lastFn.current.apply(undefined, args)
            isExecuting.current = false
            return res
        }
    }, [])

}
