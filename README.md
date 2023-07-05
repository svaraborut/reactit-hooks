
# ⚓ @reactit/hooks

Welcome to `@reactit/hooks`, a great resource for useful `React` hooks. This package aims
to become an exhaustive resource of pure hooks and only hooks, you will find no react components
here.

# Hooks

## Async

| Name                  | Description                                                |
|-----------------------|------------------------------------------------------------|
| `useAsync`            | Handle async functions inside react rendering cycles       |
| `useAsyncEffect`      | Same as `useEffect` but for async functions                |
| `useExclusivePromise` | Wraps an async function preventing concurrent calls        |
| `usePromise`          | Convert an async function to a sync one and logs the error |
| `useQuery`            | Similar to `useAsync` but automatically run on mount       |
| `useSharedAsync`      | Same as `useAsync` but calls to async function are shared  |
| `useSharedPromise`    | Wraps an async function joining concurrent calls           |

## Browser

| Name           | Description                                    |
|----------------|------------------------------------------------|
| `useIsMobile`  | Simple detect of mobile devices by `userAgent` |

## Dom

| Name           | Description                        |
|----------------|------------------------------------|
| `useEvent`     | An effect to subscribe to an event |
| `useGlobalTag` | Handles global tag life cycle      |

## Effects

| Name                 | Description                                  |
|----------------------|----------------------------------------------|
| `useScheduledEffect` | An effect that executes at a specific `Date` |

> todo : move to Time

## Files

| Name                 | Description                                                                     |
|----------------------|---------------------------------------------------------------------------------|
| `useDownload`        | Handles download of an `url` using the browser builtin download functionalities |
| `useFileSelect`      | Prompts the user to select files through the builtin file selection modal       |
| `useFileSelectState` | Same as `useFileSelect` but is a state                                          |

## Generic

| Name                | Description                                                |
|---------------------|------------------------------------------------------------|
| `useLatest`         |                                                            |
| `useLatestCallback` |                                                            |
| `usePrevious`       |                                                            |

## Navigation

| Name                     | Description                                                |
|--------------------------|------------------------------------------------------------|
| `useHref`                |                                                            |
| `useLocation`            |                                                            |
| `useSearchParam`         |                                                            |

## State

| Name                     | Description                                                |
|--------------------------|------------------------------------------------------------|
| `useDefault`             |                                                            |
| `usePatch`               |                                                            |
| `useReset`               |                                                            |

## Storage

| Name                     | Description                                                |
|--------------------------|------------------------------------------------------------|
| `useLocalStorageValue`   |                                                            |
| `useReactiveStorage`     |                                                            |
| `useSessionStorageValue` |                                                            |
| `useStorage`             |                                                            |
| `useStorageValue`        |                                                            |

## Time

| Name                     | Description                                                |
|--------------------------|------------------------------------------------------------|
| `useInterval`            |                                                            |

### `useAsync`
An asynchronous wrapping function, that enables use of async functions within
React functional components. This hook handles the entire lifecycle of a promise.

```ts
const {
    isLoading,
    isCompleted,
    isSucceed,
    isFailed,
    result,
    error,
    run,
    runAsync,
} = useAsync<Res, Args>(async (...args: Args) => { ... })
```

### `useAsyncEffect`
Same as `useEffect` but for async functions, the only difference is that destructors are not supported.

```ts
useAsyncEffect(async () => {
    ...
}, [deps])
```

### `useExclusivePromise`
Wraps an async function such that only one call at-a-time may be in execution,
any attempt to call the promise while another execution is in progress
will result in the second call throwing an exception.

```ts
const fn = useExclusivePromise(async (...args) => { ... })
```

### `usePromise`
Wraps an async function and returns a plain function to be used inside sync functions
and component callbacks, any exceptions will catch and console.debug() for
development purposes.

```ts
const fn = usePromise(async (...args) => { ... })
```

### `useQuery`
An asynchronous wrapping function, that enables use of async functions within
React functional components. This hook handles the entire lifecycle of a promise.

```ts
const {
    isLoading,
    isCompleted,
    isSucceed,
    isFailed,
    result,
    error,
    reload,
    reloadAsync
} = useQuery<Res, Args>(async (...args: Args) => { ... })
```

### `useSharedAsync`
Same as `useAsync` but `useSharedPromise` logic applies. Eg, if the async function is
called multiple times while still running, the wrapped promise will be called only once.

```ts
const {
    isLoading,
    isCompleted,
    isSucceed,
    isFailed,
    result,
    error,
    run,
    runAsync,
} = useSharedAsync<Res, Args>(async (...args: Args) => { ... })
```

### `useSharedPromise`
Joins multiple promise call into one, only one promise will be running
at-a-time, calls are not queued but rather joined. When promises are
called with arguments if arguments are the same as the original call
the promise will be joined and wait for the completion, if arguments
are different the promise will throw a concurrency exception.

```ts
const fn = useSharedPromise(async (...args) => { ... })
```

# Proposals

- Some cookie hooks
- Some JWT hooks [See](https://www.npmjs.com/package/react-jwt)
