import { Dispatch, SetStateAction } from 'react';
import { useStorageValue } from './useStorageValue';

export function useLocalStorageValue<S>(
    key: string,
    initialState: S | (() => S),
) : [S, Dispatch<SetStateAction<S>>]

export function useLocalStorageValue<S = undefined>(
    key: string,
) : [S | undefined, Dispatch<SetStateAction<S | undefined>>]


export function useLocalStorageValue<S>(
    key: string,
    initialState?: S | (() => S),
) : [S, Dispatch<SetStateAction<S>>] {

    return useStorageValue<S>(key, initialState as any, 'localStorage')

}
