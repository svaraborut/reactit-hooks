import { useCallback } from 'react'
import { useLatest } from './useLatest';

export type SimpleFn<Args extends any[], Res> = (...args: Args) => Res

/**
 * Wraps useLatest and adds a useCallback. Produces a stable callback given
 * a possibly unstable input function. The returned function is granted to
 * be stable, but will always call the latest function passed to the hook
 */
export function useLatestCallback<Res, Args extends any[] = []>(fn: SimpleFn<Args, Res>): SimpleFn<Args, Res> {
    const latest = useLatest(fn)
    return useCallback((...args) => latest.current(...args), [])
}
