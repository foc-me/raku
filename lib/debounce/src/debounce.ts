import createCurrent from "lib/createCurrent/src/createCurrent"
import is from "lib/is/src/is"

export type DebounceOption = {
    once: boolean
    delay: number
    max: number | boolean
    leading: boolean
    trailing: boolean
}

const defaultOption: DebounceOption = {
    once: false,
    delay: 0,
    max: false,
    leading: false,
    trailing: true
}

export interface DebounceConstructorCallback {
    new (...args: any[]): DebounceConstructorCallback
}

export type DebounceCallback = (...args: any[]) => unknown

function debounce(callback: DebounceCallback | DebounceConstructorCallback, delay?: Partial<DebounceOption> | number, option?: Partial<DebounceOption>) {
    if (is.number(delay)) delay = { delay }
    else delay = delay || {}
    const localOption: DebounceOption = Object.assign({}, defaultOption, delay, option)

    const [prev, setPrev] = createCurrent(Date.now())
    const [t, updateT] = createCurrent(0)
    const clearT = () => {
        if (t.current) clearTimeout(t.current)
        updateT(0)
    }
    const setT = (next: number) => {
        clearT()
        updateT(next)
    }

    const [called, updateCalled] = createCurrent(false)
    const setCalled = () => {
        if (called.current === false) updateCalled(true)
    }

    const debouceCallback = function(this: any, ...args: any[]) {
        const { once, delay, max, leading, trailing } = localOption
        const call = (args: any[]) => {
            setPrev(Date.now())
            setCalled()
            // if (this instanceof arguments.callee) {
            //     return new (callback as DebounceConstructorCallback)(...args)
            // }
            return (callback as DebounceCallback).apply(this, args)
        }
        if (once && called.current) {
            clearT()
            return
        }

        const now = Date.now()
        const duration = now - prev.current
        if (is.number(max) && duration > max) {
            clearT()
            if (leading) setT(window.setTimeout(clearT, delay))
            return call(args)
        }

        if (leading) {
            if (t.current === 0) {
                setT(window.setTimeout(clearT, delay))
                return call(args)
            }
        }
        if (trailing) {
            clearT()
            return setT(window.setTimeout(() => {
                clearT()
                call(args)
            }, delay))
        }
    }

    debouceCallback.clear = () => { clearT() }
    debouceCallback.pending = () => t.current > 0
    return debouceCallback
}

export default debounce