import is from "lib/is/src/is"
import { EventCallback } from "lib/createController/src/createController"
import provideEmitter from "lib/provideEmitter/src/provideEmitter"

function createEmitter(emitter: ReturnType<typeof provideEmitter>) {
    const { addEvent, callEvent, removeType, removeTypeEvent, removeEvent, clearEvent } = emitter

    const on = (type: string | string[], ...callback: EventCallback[]) => {
        return callback.reduce((res, currentCallback) => {
            return addEvent(type, currentCallback) && res
        }, true)
    }
    const once = (type: string | string[], ...callback: EventCallback[]) => {
        return callback.reduce((res, currentCallback) => {
            return addEvent(type, currentCallback, { once: true }) && res
        }, true)
    }

    const emit = (type: string | string[], ...args: any[]) => {
        if (is.array(type)) {
            return type.forEach(currentType => {
                emit(currentType, ...args)
            })
        }
        return callEvent(type, ...args)
    }

    const clear: (types?: string | string[] | EventCallback, ...callbacks: EventCallback[]) => boolean = (types, ...callbacks) => {
        if (is.function(types)) {
            callbacks.unshift(types)
            types = undefined
        }
        if (is.string(types)) {
            if (callbacks && callbacks.length > 0) {
                return removeTypeEvent(types, ...callbacks)
            } else return removeType(types)
        }
        if (is.array(types)) {
            return types.reduce((res, current) => {
                return clear(current, ...callbacks) && res
            }, true)
        }
        if (callbacks && callbacks.length > 0) {
            return removeEvent(...callbacks)
        }
        return clearEvent()
    }

    return { on, once, emit, clear }
}

export default createEmitter