import { Dispatch, SetStateAction, useState } from 'react';
import { resolveHookAction, resolveHookInitialValue } from '../utils';
import { getStorage, StorageTypes } from './storage';

/**
 * Offers an abstraction layer atop SessionStorage and LocalStorage.
 * This hook is similar to useStorage() but handle a single value.
 *
 * /B 2022-10-19
 */

export function useStorageValue<S>(
    key: string,
    initialState: S | (() => S),
    storage?: StorageTypes,
) : [S, Dispatch<SetStateAction<S>>]

export function useStorageValue<S = undefined>(
    key: string,
    initialState?: undefined,
    storage?: StorageTypes,
) : [S | undefined, Dispatch<SetStateAction<S | undefined>>]

export function useStorageValue<S>(
    key: string,
    initialState?: S | (() => S),
    storage: StorageTypes = 'localStorage',
) : [S, Dispatch<SetStateAction<S>>] {

    const [state, dispatch] = useState<S>(() => {
        const v = getStorage(storage).getItem(key)
        return (v !== null ? JSON.parse(v) : undefined) ?? resolveHookInitialValue(initialState)
    })

    function setState(action: SetStateAction<S>) {
        dispatch(old => {
            const nw = resolveHookAction(action, old)
            getStorage(storage).setItem(key, typeof nw === 'string' ? nw : JSON.stringify(nw))
            return nw
        })
    }

    return [state, setState]
}
