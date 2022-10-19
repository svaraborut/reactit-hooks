import { PromiseFn } from './types';
import { useAsync, UseAsyncReturn } from './useAsync';
import { useSharedPromise } from './useSharedPromise';
import { usePromise } from './usePromise';

/**
 * Same to useAsync() but when calling concurrently the task will behave same
 * as useSharedPromise(). Eg.: the call will be joint if the arguments are the
 * same or will throw if arguments have changed.
 */

export function useSharedAsync<Res = void, Args extends any[] = [], Err = any>(
    fn: PromiseFn<Args, Res>,
): UseAsyncReturn<Res, Args, Err> {

    const { runAsync: oldRunAsync, run: oldRun, ...rest } = useAsync(fn);
    const runAsync = useSharedPromise(oldRunAsync)
    const run = usePromise(runAsync)

    return {
        ...rest,
        runAsync,
        run,
    };

}
