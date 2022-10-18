import { useLocation } from './useLocation';

/**
 * Returns the current page url
 *
 * /B 2022-10-19
 */
export function useHref(): string | undefined {

    return useLocation().href
    
}
