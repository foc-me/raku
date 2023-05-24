export enum EventType {
    call = "call",
    timeout = "timeout",
    then = "then",
    sync = "sync"
}

export type EventOption = {
    type: EventType
}

export type EventCallback = (...args: any[]) => unknown

const defaultEventOption = { type: EventType.sync }

function createController() {
    const map: Map<EventCallback, EventOption | undefined> = new Map()
    const has = (fn: EventCallback) => {
        return map.has(fn)
    }
    const add = (fn: EventCallback, option?: Partial<EventOption>) => {
        const eventOption: EventOption = Object.assign({}, defaultEventOption, option)
        if (!has(fn)) map.set(fn, eventOption)
        return has(fn)
    }
    const remove = (fn: EventCallback) => {
        if (has(fn)) map.delete(fn)
        return !has(fn)
    }
    const size = () => map.size
    const call = (...args: any[]) => {
        return new Promise<void>(async (resolve) => {
            try {
                const entries = map.entries()
                let next = entries.next()
                while (!next.done) {
                    const [fn, option] = next.value
                    const { type = EventType.call } = option || {}
                    switch (type) {
                        case EventType.timeout:
                            window.setTimeout(() => {
                                fn(...args)
                            })
                            break
                        case EventType.then:
                            Promise.resolve().then(() => {
                                fn(...args)
                            })
                            break
                        case EventType.sync:
                            await fn(...args)
                            break
                        default:
                            fn(...args)
                            break
                    }
                    next = entries.next()
                }
                resolve()
            } catch (e) {
                throw e
            }
        })
    }
    const clear = () => {
        map.clear()
        return true
    }
    return { has, add, remove, size, call, clear }
}

export default createController