import { useReset } from '../state/useReset';
import { useEvent } from '../dom/useEvent';

/**
 * Returns an updated version of the window.location object. Using
 * this hook will cause the component to re-render each time location
 * changes.
 *
 * /B 2022-10-19
 */
export function useLocation(): Location {

    const [value, _, resetValue] = useReset(() => window.location)

    useEvent(['popstate', 'pushstate', 'replacestate'], resetValue)

    return value

}
