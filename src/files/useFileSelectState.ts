import { useFileSelect, UseFileSelectProps } from './useFileSelect';
import { useState } from 'react';
import { useAsync } from '../async/useAsync';

export interface UseFileSelectStateProps extends UseFileSelectProps {
    initialFiles?: File[];
}

export interface UseFileSelectStateReturn {
    files: File[]
    isSelecting: boolean
    select: () => void
}

/**
 * File select state. Returns a file state and a select function, when called will open
 * the native file selection modal that will affect the files list upon closing.
 */
export function useFileSelectState(props?: UseFileSelectStateProps): UseFileSelectStateReturn {

    const [files, setFiles] = useState<File[]>(props?.initialFiles ?? []);
    const selectFn = useFileSelect(props);
    const selectAsync = useAsync(async () => setFiles((await selectFn()) ?? []))

    return {
        files,
        isSelecting: selectAsync.isLoading,
        select: selectAsync.run,
    }

}
