import { DependencyList, useEffect } from 'react';
import { AsyncCallFn } from './types';
import { useLatest } from '../generic/useLatest';

/**
 * Syntactic sugar to have effects with async functions
 *
 * /B 2022-10-19
 */
export function useAsyncEffect(fn: AsyncCallFn, deps?: DependencyList) {

    const lastFn = useLatest(fn)

    useEffect(() => {
        lastFn.current().catch((error: any) => {
            console.debug(`useAsyncEffect collected an error ${fn.name}`, error)
        })
    }, deps)

}
