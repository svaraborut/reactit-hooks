import { useGlobalTag } from '../dom/useGlobalTag';


export type DownloadFunction = (url: string, filename?: string) => void

/**
 * File download hook. Returns a function which upon call will initiate a native
 * file download by calling an underlying link object.
 */
export function useDownload(): DownloadFunction {
    const ref = useGlobalTag('a')

    return (url: string, filename?: string) => {
        if (!ref.current) return;
        ref.current.href = url;
        if (filename) ref.current.setAttribute('download', filename)
        else ref.current.removeAttribute('download')
        ref.current.click()
    }

}
