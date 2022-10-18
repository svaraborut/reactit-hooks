import { useCallback, useRef } from 'react';
import { PromiseFn, ConcurrencyError } from './types';
import { useLatest } from '../generic/useLatest';

/**
 * Wraps a promise such that only one call at-a-time may be in execution,
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
export function useExclusivePromise<R, A extends any[] = []>(fn: PromiseFn<A, R>): PromiseFn<A, R> {

    const lastFn = useLatest(fn)
    const isExecuting = useRef<boolean>(false)

    return useCallback(async (...args: A): Promise<R> => {
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
