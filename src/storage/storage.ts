
export type StorageTypes = 'sessionStorage' | 'localStorage' | 'ram'
export type MultiValue = { [K: string]: any }

// Simple implementation of a Storage that will hold the values in ram
class RamStorage implements Storage {

    get length() {
        return Object.keys(this).length
    }

    clear() {
        for (const key of Object.keys(this)) {
            delete this[key]
        }
    }

    getItem(key: string): string | null {
        return this[key] ?? null
    }

    key(index: number): string | null {
        return Object.keys(this)[index] ?? null
    }

    removeItem(key: string) {
        delete this[key]
    }

    setItem(key: string, value: string) {
        this[key] = value
    }

}

const ramStorage = new RamStorage()

export function getStorage(type: StorageTypes) {
    return type === 'ram' ? ramStorage : type === 'sessionStorage' ? window.sessionStorage : window.localStorage;
}

// Collect all values starting with a prefix and strip them of the prefix
export function readStorageMulti(storage: Storage, prefix: string): MultiValue | undefined {
    const res: any = {}
    let count = 0
    for (const key of Object.keys(storage)) {
        if (key.startsWith(prefix)) {
            res[key.substring(prefix.length)] = JSON.parse(storage.getItem(key)!)
            count ++
        }
    }
    return count > 0 ? res : undefined
}

// Store the entire object with the prefix and delete any other key
export function setStorageMulti(storage: Storage, prefix: string, value: MultiValue | undefined) {
    // Clear extra keys
    for (const key of Object.keys(storage)) {
        if (key.startsWith(prefix) && value?.[key.substring(prefix.length)] === undefined) {
            storage.removeItem(key)
        }
    }
    // Add / update others
    if (value) {
        for (const key of Object.keys(value)) {
            if (value[key] !== undefined) {
                const v = typeof value[key] === 'string' ? value[key] : JSON.stringify(value[key]);
                storage.setItem(prefix + key, v)
            }
        }
    }
}
