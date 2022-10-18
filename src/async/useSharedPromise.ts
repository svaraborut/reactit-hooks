import { useCallback, useRef } from 'react';
import { PromiseFn, ConcurrencyError } from './types';
import { useLatest } from '../generic/useLatest';
import { areArgsEqual } from '../utils';

/**
 * Joins multiple promise call into one, only one promise will be running
 * at-a-time, calls are not queued but rather joined. When promises are
 * called with arguments if arguments are the same as the original call
 * the promise will be joined and wait for the completion, if arguments
 * are different the promise will throw a concurrency exception.
 *
 * (?) Arguments are shallow compared with Object.is
 * (same strategy that is used by React on effect dependencies)
 *
 * (!) Task should be stable, changing task while a call is in progress
 * will not affect the outcome nor interrupt the execution.
 *
 * (?) Returned task is assured to be stable, an old result instance will
 * always call the most fresh task.
 *
 * /B 2022-10-19
 */
export function useSharedPromise<R, A extends any[] = []>(fn: PromiseFn<A, R>): PromiseFn<A, R> {

    const lastFn = useLatest(fn)
    const stack = useRef<{ args: A, res: ((v: R) => void)[], rej: ((e: any) => void)[] } | undefined>()

    return useCallback(async (...args: A): Promise<R> => {
        return new Promise<R>((res, rej) => {
            if (!stack.current) {
                // First execution
                stack.current = { args, res: [res], rej: [rej] }

                lastFn.current.apply(undefined, args)
                    .then((r: R) => {
                        stack.current?.res.forEach(f => f(r))
                        stack.current = undefined
                    })
                    .catch((e: any) => {
                        stack.current?.rej.forEach(f => f(e))
                        stack.current = undefined
                    })

            } else {
                // Join or fail
                if (!areArgsEqual(stack.current?.args, args)) {
                    rej(new ConcurrencyError(`Promise already running with different arguments`))
                } else {
                    stack.current.res.push(res)
                    stack.current.rej.push(rej)
                }
            }

        })
    }, [])

}
