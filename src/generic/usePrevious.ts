import { useEffect, useRef } from 'react';

/**
 * This hook will return the previous value of a state. The previous
 * value is the last stable value after the previous rendering cycle.
 */
export function usePrevious<T>(state: T): T | undefined {
    const ref = useRef<T>();

    // Update ref after the current rendering cycle
    useEffect(() => { ref.current = state })

    return ref.current;
}
