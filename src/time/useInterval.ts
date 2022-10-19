import { CallFn } from '../async/types';
import { DependencyList, useEffect } from 'react';
import { useLatest } from '../generic/useLatest';

/**
 * Simply set an interval by providing a callback and delay, the interval
 * is automatically mounted and unmounted.
 *
 * (?) When delay changes the interval is updated, to disable it just
 *     provide null or undefined as delay.
 *
 * (?) Additionally a list of dependencies can be provided. The dependencies
 *     will cause the interval to be rescheduled (delay is implicitly a
 *     dependency)
 *
 * todo : add enable fn to return a tear down function
 */
export function useInterval(fn: CallFn, ms?: number | null | undefined, deps?: DependencyList) {

    const lastFn = useLatest(fn)

    useEffect(() => {

        if (ms === undefined || ms === null) return undefined;

        const interval = setInterval(() => lastFn.current(), ms || 0)
        return () => clearInterval(interval)

    }, [ms, ...(deps || [])])

}
