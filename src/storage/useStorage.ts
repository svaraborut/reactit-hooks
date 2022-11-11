import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { resolveHookAction, resolveHookInitialValue } from '../utils';
import { getStorage, MultiValue, readStorageMulti, setStorageMulti, StorageTypes } from './storage';

/**
 * Offers an abstraction layer atop SessionStorage and LocalStorage.
 * This hook expects an objects as its state and stores each key of
 * the object as a JSON ENCODED value.
 *
 * (?) Optionally prefix can be provided to prefix each object key
 *     inside the underlying storage (to prevent collisions)
 *
 * (?) Optionally an initial value can be provided that will be used
 *     when no key for the given prefix will be detected in the store.
 *     Keep in mind that store keys may be anyhow deleted, so never
 *     give for granted their presence (not their pairwise presence)
 *
 * /B 2022-10-19
 */

export function useStorage<S extends MultiValue>(
    initialState?: S | (() => S),
    prefix: string = '',
    storage: StorageTypes = 'localStorage',
) : [S, Dispatch<SetStateAction<S>>] {

    const [state, dispatch] = useState<S>(() => {
        return readStorageMulti(getStorage(storage), prefix) as S ?? resolveHookInitialValue(initialState)
    })

    function setState(action: SetStateAction<S>) {
        dispatch(old => {
            const nw = resolveHookAction(action, old)
            setStorageMulti(getStorage(storage), prefix, nw)
            return nw
        })
    }

    // Switch dynamically storage
    const lastStorage = useRef<StorageTypes | undefined>()

    useEffect(() => {
        if (lastStorage.current) setStorageMulti(getStorage(lastStorage.current), prefix, undefined)
        lastStorage.current = storage
        setStorageMulti(getStorage(storage), prefix, state)
    }, [storage])

    return [state, setState]
}
