import is from "lib/is/src/is"

export type Current<T> = { current: T }
export type CurrentInit<T> = T | (() => T)
export type setCurrent<T> = (next: T | ((t: T) => T)) => void

function createCurrent<T>(init: CurrentInit<T>): [Current<T>, setCurrent<T>] {
    const initResult = is.function(init) ? init() : init
    const ref: Current<T> = { current: initResult }
    const setRef: setCurrent<T> = (next) => {
        if (is.function(next)) {
            ref.current = next(ref.current)
        } else ref.current = next
    }
    return [ref, setRef]
}

export default createCurrent