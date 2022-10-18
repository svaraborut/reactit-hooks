import { AsyncFn, CallFn } from './types';
import { UseAsyncState } from './useAsync';
import { useSharedAsync } from './useSharedAsync';
import { DependencyList, useEffect } from 'react';

/**
 * An asynchronous wrapping function, that enables use of async functions within
 * React functional components. This hook handles the entire lifecycle of a promise.
 *
 * (?) When the promise is executing, calling it again will result in the previous
 *     execution being ignored. Eg.: the last call to run / runAsync will always be
 *     the one that is affecting the state.
 */

export interface UseQueryReturn<Res = void, Err = any> extends UseAsyncState<Res, Err> {
    reloadAsync: AsyncFn<Res>
    reload: CallFn
}

export function useQuery<Res = void, Err = any>(fn: AsyncFn<Res>, deps?: DependencyList): UseQueryReturn<Res, Err> {

    const { run, runAsync, ...state } = useSharedAsync(fn)
    useEffect(run, deps)

    return {
        ...state,
        reloadAsync: runAsync,
        reload: run,
    };

}
