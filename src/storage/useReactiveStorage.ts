import { Dispatch, SetStateAction } from 'react';
import { getStorage, MultiValue, StorageTypes } from './storage';
import { useStorage } from './useStorage';
import { useEvent } from '../dom/useEvent';
import { useLatest } from '../generic/useLatest';

/**
 * Same as useStorage() but does enable dynamic storage updates by
 * subscribing to the window `storage` event.
 */

export function useReactiveStorage<S extends MultiValue>(
    initialState?: S | (() => S),
    prefix: string = '',
    storage: StorageTypes = 'localStorage',
) : [S, Dispatch<SetStateAction<S>>] {

    const [state, setState] = useStorage(initialState, prefix, storage)

    const ctx = useLatest({ prefix, storage })

    useEvent('storage', event => {
        const c = ctx.current
        if (event.key?.startsWith(c.prefix) && event.storageArea === getStorage(c.storage)) {
            setState(last => ({
                ...last,
                [event.key!.substring(c.prefix.length)]: event.newValue
            }))
        }
    })

    return [state, setState]
}
