
export type HookAction<V, Args extends any[]> = V | ((...args: Args) => V);

export function resolveHookAction<V, Args extends any[]>(action: HookAction<V, Args>, ...args: Args): V {
    return typeof action === 'function' ? (action as any)(...args) : action;
}

/**
 * Compares two arrays to contain the same values (according to Object.is)
 */
export function areArgsEqual(a: any[], b: any[]) {
    if (Array.isArray(a) && Array.isArray(b)) {
        for (let i = 0; i < a.length && i < b.length; i++) {
            if (!Object.is(a[i], b[i])) {
                return false;
            }
        }
        return true
    } else {
        return Object.is(a, b)
    }
}
