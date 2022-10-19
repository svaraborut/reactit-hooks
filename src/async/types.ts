
export type CallFn = () => void
export type DispatchFn<Args extends any[]> = (...args: Args) => void

export type PromiseFn<Args extends any[], Res> = (...args: Args) => Promise<Res>
export type AsyncFn<Res> = () => Promise<Res>
export type AsyncCallFn = () => Promise<void>

export class ConcurrencyError extends Error {
    constructor(m?: string) {
        super(m ?? 'Concurrent execution is not permitted');
    }
}
