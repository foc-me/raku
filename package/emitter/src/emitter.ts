import useController, { EventType, EventOption } from "./controller";

type emitter = {
    check?: boolean
}

const defaultConfig: emitter = {
    check: false
}

export function createEmitter(config?: emitter) {
    const { check } = Object.assign({}, defaultConfig, config)
    const events = new Map<string, ReturnType<typeof useController>>()

    const getController = (type: string) => {
        const controller = events.get(type) || useController()
        if (!events.has(type)) events.set(type, controller)
        return controller
    }

    const addEvent = (type: string | string[], callback: Function, option?: EventOption) => {
        type = Array.isArray(type) ? type : [type]
        return type.reduce((res, currentType) => {
            const controller = getController(currentType)
            return controller.add(callback, option) && res
        }, true)
    }

    const callEvent = (type: string, ...args: any[]) => {
        const controller = getController(type)
        return controller.call(...args)
    }

    const removeType: (type: string | string[]) => boolean = (type) => {
        if (typeof type === "string") return removeType([type])
        return type.reduce((res, current) => {
            const controller = getController(current)
            return controller.clear() && res
        }, true)
    }
    const removeTypeEvent = (type: string, ...callbacks: Function[]) => {
        const controller = getController(type)
        return callbacks.reduce((res, callback) => {
            return controller.remove(callback) && res
        }, true)
    }
    const removeEvents = (...callbacks: Function[]) => {
        const result = []
        const values = events.values()
        let next = values.next()
        while (!next.done) {
            result.push(callbacks.reduce((res, callback) => {
                return next.value.remove(callback) && res
            }, true))
            next = values.next()
        }
        return result.reduce((res, current) => {
            return res && current
        }, true)
    }

    const clearEvents = () => {
        const values = events.values()
        let current = values.next()
        while (!current.done) {
            current.value.clear()
            current = values.next()
        }
        events.clear()
        return true
    }

    const checkEvents = () => {
        setTimeout(() => {
            const entries = events.entries()
            let next = entries.next()
            while (!next.done) {
                const [type, controller] = next.value
                if (controller.size() < 1) events.delete(type)
                next = entries.next()
            }
            checkEvents()
        }, 600000)
    }
    if (check === true) checkEvents()

    return { addEvent, callEvent, removeType, removeTypeEvent, removeEvents, clearEvents }
}

export function useEmitter(emitter: ReturnType<typeof createEmitter>) {
    const { addEvent, callEvent, removeType, removeTypeEvent, removeEvents, clearEvents } = emitter

    const on = (type: string | string[], ...callback: Function[]) => {
        return callback.reduce((res, currentCallback) => {
            return addEvent(type, currentCallback) && res
        }, true)
    }
    const once =(type: string | string[], ...callback: Function[]) => {
        return callback.reduce((res, currentCallback) => {
            return addEvent(type, currentCallback, { type: EventType.once }) && res
        }, true)
    }

    const emit = (type: string | string[], ...args: any[]) => {
        if (Array.isArray(type)) {
            return type.forEach(currentType => {
                emit(currentType, ...args)
            })
        }
        return callEvent(type, ...args)
    }

    const clear: (types?: string | string[] | Function, ...callbacks: Function[]) => boolean = (types, ...callbacks) => {
        if (typeof types === "function") {
            callbacks.unshift(types)
            types = undefined
        }
        if (typeof types === "string") {
            if (callbacks && callbacks.length > 0) {
                return removeTypeEvent(types, ...callbacks)
            } else return removeType(types)
        }
        if (Array.isArray(types)) {
            return types.reduce((res, current) => {
                return clear(current, ...callbacks) && res
            }, true)
        }
        if (callbacks && callbacks.length > 0) {
            return removeEvents(...callbacks)
        }
        return clearEvents()
    }

    return { on, once, emit, clear }
}

export default useEmitter(createEmitter())