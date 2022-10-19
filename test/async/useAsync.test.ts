import { act, renderHook } from '@testing-library/react-hooks';
import { useAsync } from '../../src';

describe('useAsync', () => {

    function factory(resolve: boolean = true, result: string = 'done', ms: number = 0) {
        return () => {
            return new Promise((res, rej) => {
                const wait = setTimeout(() => {
                    clearTimeout(wait);
                    (resolve ? res : rej)(result)
                }, ms)
            })
        }
    }

    function hook() {
        return renderHook(
            ({ fn }) => useAsync(fn),
            { initialProps: { fn: factory(true) }}
        )
    }

    it('should be defined', () => {
        expect(useAsync).toBeDefined()
    })

    it('should be initialized', async () => {
        const h = hook()
        expect(h.result.current).toMatchObject({
            isLoading: false,
            isCompleted: false,
            isSucceed: false,
            isFailed: false,
            // result: undefined,
            // error: undefined,
        })
        expect(h.result.current).not.toHaveProperty('result')
        expect(h.result.current).not.toHaveProperty('error')
    })

    describe('run()', () => {

        it('should resolve', async () => {
            const h = hook()

            // const res = await h.result.current.runAsync()
            act(() => {
                h.result.current.run()
            })
            await h.waitForNextUpdate()

            expect(h.result.current).toMatchObject({
                isLoading: false,
                isCompleted: true,
                isSucceed: true,
                isFailed: false,
                result: 'done',
            })
        })

        it('should fail', async () => {
            const h = hook()
            await h.rerender({ fn: factory(false) })

            // let err;
            // try {
            //     await h.result.current.runAsync()
            // } catch (e) {
            //     err = e
            // }

            act(() => {
                h.result.current.run()
            })
            await h.waitForNextUpdate()

            expect(h.result.current).toMatchObject({
                isLoading: false,
                isCompleted: true,
                isSucceed: false,
                isFailed: true,
                error: 'done',
            })
        })

    })

    // todo : how to wait for the promise ?
    // describe('runAsync()', () => {
    //
    //     it('should resolve', async () => {
    //         const h = hook()
    //
    //         let res = 'xxx'
    //         await act(async () => {
    //             return h.result.current.runAsync()
    //         })
    //
    //         await h.waitForNextUpdate()
    //
    //         expect(h.result.current).toMatchObject({
    //             isLoading: false,
    //             isCompleted: true,
    //             isSucceed: true,
    //             isFailed: false,
    //             result: res,
    //         })
    //     })
    //
    //     it('should fail', async () => {
    //         const h = hook()
    //         await h.rerender({ fn: factory(false) })
    //
    //         // let err;
    //         // try {
    //         //     await h.result.current.runAsync()
    //         // } catch (e) {
    //         //     err = e
    //         // }
    //
    //         h.result.current.run()
    //         await h.waitForNextUpdate()
    //
    //         expect(h.result.current).toMatchObject({
    //             isLoading: false,
    //             isCompleted: true,
    //             isSucceed: false,
    //             isFailed: true,
    //             error: 'done',
    //         })
    //     })
    //
    // })

    it('supports unstable function', async () => {
        const h = hook()
        await h.rerender({ fn: factory(true, 'v1') })
        await h.rerender({ fn: factory(true, 'v2') })

        act(() => {
            h.result.current.run()
        })
        await h.waitForNextUpdate()

        expect(h.result.current.result).toEqual('v2')
    })

    it('is loading', async () => {
        jest.useFakeTimers()

        const h = hook()
        await h.rerender({ fn: factory(true, 'slow', 1000) })

        act(() => {
            h.result.current.run()
        })

        expect(h.result.current).toMatchObject({
            isLoading: true,
            isCompleted: false,
            isSucceed: false,
            isFailed: false,
        })

        act(() => {
            jest.runAllTimers()
        })

        await h.waitForNextUpdate()
        expect(h.result.current).toMatchObject({
            isLoading: false,
            isCompleted: true,
            isSucceed: true,
            isFailed: false,
            result: 'slow',
        })
    })

})
