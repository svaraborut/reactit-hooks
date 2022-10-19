import { DependencyList, useEffect, useRef } from 'react';
import { useLatest } from '../generic/useLatest';

/**
 * This effect will run only once at a specified time (unix or date).
 * If on mount the time is in the past will run immediately or skip the
 * run is `maximumExpiration` option is exceeded.
 */

export interface UseScheduledEffectOptions {
    // How old can be the event on mount to still run the effect (defaults to any)
    maximumExpiration?: number
}

export function useScheduledEffect(
    fn: () => void,
    at: number | Date | undefined,
    deps?: DependencyList,
    options?: UseScheduledEffectOptions,
) {

    const latestFn = useLatest(fn)
    const hasRun = useRef(false)

    useEffect(() => {

        // Skip
        if (at === undefined || hasRun.current) return undefined;

        // Coerce
        const unix = typeof at === 'number' ? at : at.getTime()
        const now = Date.now()

        if (unix <= now) {
            // Run now
            if (options?.maximumExpiration === undefined || (now - unix) < options?.maximumExpiration) {
                latestFn.current();
                hasRun.current = true;
            }
            return undefined;

        } else {
            // Schedule for future
            const tm = setTimeout(() => latestFn.current(), unix - now)
            return () => clearTimeout(tm)

        }

    }, [at, ...(deps || [])])

}

