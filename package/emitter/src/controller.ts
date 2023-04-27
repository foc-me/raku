export enum EventType {
    call = "call",
    once = "once"
}

export type EventOption = {
    type: EventType
}

export default function useController() {
    const map: Map<Function, EventOption | undefined> = new Map()
    const has = (fn: Function) => {
        return map.has(fn)
    }
    const add = (fn: Function, option?: EventOption) => {
        if (!has(fn)) map.set(fn, option)
        return has(fn)
    }
    const remove = (fn: Function) => {
        if (has(fn)) map.delete(fn)
        return !has(fn)
    }
    const size = () => map.size
    const call = (...args: any[]) => {
        const entries = map.entries()
        let next = entries.next()
        while (!next.done) {
            const [fn, option] = next.value
            fn(...args)
            if (option && option.type === EventType.once) {
                remove(fn)
            }
            next = entries.next()
        }
    }
    const clear = () => {
        map.clear()
        return true
    }
    return { has, add, remove, size, call, clear }
}