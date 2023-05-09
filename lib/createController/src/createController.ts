export enum EventType {
    call = "call",
    once = "once"
}

export type EventOption = {
    type: EventType
}

export type EventCallback = (...args: any[]) => unknown

const defaultEventOption = { type: EventType.call }

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

export type CreateEventOption = {
    once: boolean
}

const createEventOption: (setting: Partial<CreateEventOption>) => EventOption = (setting) => {
    const { once } = setting || {}
    return {
        type: once ? EventType.once : EventType.call
    }
}

createController.createEventOption = createEventOption

export default createController