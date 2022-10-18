import { MutableRefObject, useRef } from 'react';

/**
 * Keeps a useRef() handle updated to the most recent value, useful
 * to inject unstable values/callback into memoized functions, example:
 *
 * function useSomething(callback) {
 *     const last = useLatest(callback);
 *
 *     const f = useCallback(() => {
 *         last.current?.();
 *     })
 * }
 *
 */
export function useLatest<T>(state: T): MutableRefObject<T> {
    const ref = useRef<T>(state);
    ref.current = state;
    return ref;
}
