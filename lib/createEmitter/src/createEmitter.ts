import is from "lib/is/src/is"
import type { EventOption } from "./createController"
import createController, { EventType } from "./createController"

export type EmitterCallback = (...args: any[]) => unknown
export type OnEmitter = (type: string, callback: EmitterCallback, option?: Partial<EventOption>) => boolean
export type ClearEmitter = (type?: string | EmitterCallback, callback?: EmitterCallback) => boolean

function createEmitter() {
    const events = new Map<string, ReturnType<typeof createController>>()
    const getController = (type: string) => {
        let controller = events.get(type)
        if (!controller) {
            controller = createController()
            events.set(type, controller)
        }
        return controller
    }

    const on: OnEmitter = (type, callback, option) => {
        const controller = getController(type)
        return controller.add(callback, option)
    }
    const emit = (type: string, ...args: any[]) => {
        const controller = getController(type)
        return controller.call(...args)
    }
    const clear: ClearEmitter = (type, callback) => {
        if (is.string(type)) {
            const controller = getController(type)
            if (is.function(callback)) {
                return controller.remove(callback)
            } else {
                controller.clear()
                return events.delete(type)
            }
        }
        if (is.function(type)) {
            const result = []
            const values = events.values()
            let current = values.next()
            while (!current.done) {
                result.push(current.value.remove(type))
                current = values.next()
            }
            events.clear()
            return result.reduce((res, current) => {
                return res && current
            }, true)
        }

        const values = events.values()
        let current = values.next()
        while (!current.done) {
            current.value.clear()
            current = values.next()
        }
        events.clear()
        return true
    }

    return { on, emit, clear }
}

export default createEmitter