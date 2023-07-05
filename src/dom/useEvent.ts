import { useEffect } from 'react';
import { useLatest } from '../generic/useLatest';

/**
 * Handle an event listener on the provided target. Inspired by
 * react-use useEvent(), but slightly simplified and removed the
 * requirement for the handler to be a memoized function.
 *
 * This function does also support multiple event names to be
 * provided as an array.
 */

export type ListenerTypeFn = (name: string, handler: (event?: any) => void, ...args: any[]) => void;

export interface ListenerType1 {
    addEventListener: ListenerTypeFn
    removeEventListener: ListenerTypeFn
}

export interface ListenerType2 {
    on: ListenerTypeFn
    off: ListenerTypeFn
}

type AddEventListener<T> = T extends ListenerType1
    ? T['addEventListener'] : T extends ListenerType2
    ? T['on'] : never

export type UseEventTarget = ListenerType1 | ListenerType2
// export type UseEventOptions<T> = Parameters<AddEventListener<T>>[2];

export function useEvent<T extends UseEventTarget>(
    name: Parameters<AddEventListener<T>>[0] | Parameters<AddEventListener<T>>[0][],
    handler?: undefined | null | Parameters<AddEventListener<T>>[1],
    target: undefined | null | T | Window = window,
    // options?: UseEventOptions<T>
) {

    const latest = useLatest(handler);

    useEffect(() => {

        const _target = (target as ListenerType1 & ListenerType2) || undefined
        const _names = Array.isArray(name) ? name : [name]
        const inHandler = (event?: any) => (latest.current as any)?.(event)

        const _on = _target?.addEventListener ?? _target?.on;
        _on && _names.forEach(name => _on.call(_target, name, inHandler))
        return () => {
            const _off = _target?.removeEventListener ?? _target?.off
            _off && _names.forEach(name => _off.call(_target, name, inHandler))
        }

    }, [name, target])

}
