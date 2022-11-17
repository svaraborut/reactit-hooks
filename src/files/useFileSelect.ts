import { useGlobalTag } from '../dom/useGlobalTag';


export interface UseFileSelectProps {
    multiple?: boolean;
    accept?: string[];
    capture?: 'user' | 'environment';
}

export type UseFileSelectFunction = () => Promise<File[] | undefined>;

/**
 * File select hook. Returns an async function which upon call will initiate a native
 * file selection modal and resolve upon selection completion.
 *
 * const select = useFileSelect({ multiple: true, accept: ['csv', 'xslx' ] })
 *
 */
export function useFileSelect(props?: UseFileSelectProps): UseFileSelectFunction {

    // Create a hidden input field with all the expected configs
    const ref = useGlobalTag('input', el => {
        el.setAttribute('type', 'file');
        props?.multiple
            ? el.setAttribute('multiple', 'true')
            : el.removeAttribute('multiple')
        props?.accept && el.setAttribute('accept', props.accept.join(','))
        props?.capture && el.setAttribute('capture', props.capture);
    })

    return () => {
        return new Promise<File[] | undefined>(resolve => {
            if (!ref.current) {
                resolve(undefined);
            } else {
                ref.current.addEventListener(
                    'change',
                    (event: Event) => resolve(
                        (event.target as HTMLInputElement).files
                            ? Array.from((event.target as any).files)
                            : undefined
                    ),
                    { once: true }
                )
                ref.current.click()
            }
        })
    }
}
