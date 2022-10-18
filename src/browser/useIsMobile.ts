import { useMemo } from 'react';

/**
 * This is a very simple and lightweight solution for mobile browser
 * detection. This solution is meant for non-critical features as no
 * guaranties are given by the methods used for detection. If your
 * application is critical then specialized solutions shall be used,
 * such is https://www.npmjs.com/package/react-device-detect, but
 * you should know that there are 20kB of extra code.
 *
 * This solution is inspired by this answer
 * https://stackoverflow.com/questions/11381673
 * and is deliberately developed with a keen for false-negatives,
 * hence it is likely to have mobile device not detected as such but
 * shall not be possible to have desktop devices detected as mobile.
 */

const UAs = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
];

declare global {
    interface Navigator {
        userAgentData: { mobile?: boolean }
    }
}

export interface UseIsMobileOptions {
    useExperimental?: boolean
}

export function useIsMobile(options?: UseIsMobileOptions): boolean {
    return useMemo(() => {
        if (options?.useExperimental && navigator.userAgentData) {
            return !!navigator.userAgentData.mobile
        } else {
            return UAs.some(r => navigator.userAgent.match(r))
        }
    }, [navigator.userAgentData, navigator.userAgent])
}
