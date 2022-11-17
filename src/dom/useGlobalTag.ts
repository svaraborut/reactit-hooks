import { MutableRefObject, useEffect, useRef } from 'react';


/**
 * A hook that handles creation and destruction of global hidden tags. This hook
 * can be used to create dom elements that are outside the React scope. Used
 * by other hooks that provide macro-behaviours such are download and file select
 *
 * @param tagName tag type
 * @param init tag init function
 * @param options tag creation options
 * @param container tag container (defaults to body)
 */
export function useGlobalTag<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    init?: (tag: HTMLElementTagNameMap[K]) => void,
    options?: ElementCreationOptions,
    container: HTMLElement = document.body,
): MutableRefObject<HTMLElementTagNameMap[K] | undefined> {

    // Ref to the tag
    const ref = useRef<HTMLElementTagNameMap[K]>()

    useEffect(() => {

        // Create and append to outer body
        ref.current = document.createElement<K>(tagName, options)
        ref.current.style.display = 'none'
        container.appendChild(ref.current)

        init?.(ref.current)

        // Remove the tag upon destruction
        return () => {
            if (!ref.current) return;
            container.removeChild(ref.current)
            ref.current = undefined
        }

    }, [])

    return ref;
}
