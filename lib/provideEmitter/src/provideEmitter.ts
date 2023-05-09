import createTimeout from "lib/createTimeout/src/createTimeout"
import createController, { CreateEventOption, EventCallback } from "lib/createController/src/createController"

const { createEventOption } = createController

enum CheckType {
    none = 0,
    call = 1,
    timeout = 2
}

type EmitterConfig = {
    check: CheckType,
    delay: number
}

const defaultCheckTimeout = 60000
const defaultConfig: EmitterConfig = {
    check: CheckType.none,
    delay: defaultCheckTimeout
}

function provideEmitter(config?: Partial<EmitterConfig>) {
    const localConfig: EmitterConfig = Object.assign({}, defaultConfig, config)
    const { check, delay } = localConfig
    const checkTimeout = createTimeout()
    const events = new Map<string, ReturnType<typeof createController>>()

    const getController = (type: string) => {
        const controller = events.get(type) || createController()
        if (!events.has(type)) events.set(type, controller)
        return controller
    }

    const addEvent = (type: string | string[], callback: EventCallback, option?: Partial<CreateEventOption>) => {
        type = Array.isArray(type) ? type : [type]
        return type.reduce((res, currentType) => {
            const controller = getController(currentType)
            const eventOption = createEventOption(option || {})
            return controller.add(callback, eventOption) && res
        }, true)
    }

    const removeType: (type: string | string[]) => boolean = (type) => {
        if (typeof type === "string") return removeType([type])
        return type.reduce((res, current) => {
            const controller = getController(current)
            return controller.clear() && res
        }, true)
    }
    const removeTypeEvent = (type: string, ...callbacks: EventCallback[]) => {
        const controller = getController(type)
        return callbacks.reduce((res, callback) => {
            return controller.remove(callback) && res
        }, true)
    }
    const removeEvent = (...callbacks: EventCallback[]) => {
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

    const clearEvent = () => {
        const values = events.values()
        let current = values.next()
        while (!current.done) {
            current.value.clear()
            current = values.next()
        }
        events.clear()
        return true
    }

    const checkEvent = () => {
        const entries = events.entries()
        let next = entries.next()
        while (!next.done) {
            const [type, controller] = next.value
            if (controller.size() < 1) events.delete(type)
            next = entries.next()
        }
        return true
    }
    const timeoutCheckEvent = (timeout: number) => {
        setTimeout(() => {
            checkEvent()
            timeoutCheckEvent(delay)
        }, timeout)
    }

    const callEvent = (type: string, ...args: any[]) => {
        if (check === CheckType.call && checkTimeout(delay)) {
            checkEvent()
        }
        const controller = getController(type)
        return controller.call(...args)
    }

    if (check === CheckType.timeout) timeoutCheckEvent(delay)
    return { addEvent, callEvent, removeType, removeTypeEvent, removeEvent, clearEvent }
}

export default provideEmitter