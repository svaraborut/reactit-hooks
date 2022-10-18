import { useLocation } from './useLocation';
import { useMemo } from 'react';

/**
 * Extract search param from the query whenever necessary
 *
 * /B 2022-10-19
 */
export function useSearchParam(name: string): string | undefined {

    const location = useLocation()

    return useMemo(
        () => new URLSearchParams(location.search).get(name) || undefined,
        [location]
    )

}
