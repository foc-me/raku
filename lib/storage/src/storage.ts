import createCurrent from "lib/createCurrent/src/createCurrent"
import is from "lib/is/src/is"

export enum StorageType {
    local = 1,
    session = 2
}

export type StorageGetItem = (key: string | string[]) => unknown
export type StorageSetItem = (key: string, item: unknown) => void

function storage(storageType: StorageType = StorageType.local) {
    const [storage] = createCurrent(() => {
        switch (storageType) {
            case StorageType.session: sessionStorage
            default: return localStorage
        }
    })

    const getItem: StorageGetItem = (key) => {
        if (is.array(key)) {
            return key.map(current => getItem(current))
        }
        try {
            return JSON.parse(storage.current.getItem(key) || "")
        } catch (e) {
            throw e
        }
    }

    const setItem: StorageSetItem = (key, item) => {
        try {
            const json = JSON.stringify(item)
            storage.current.setItem(key, json)
        } catch (e) {
            throw e
        }
    }

    return { getItem, setItem }
}

export default storage