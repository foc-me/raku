import is from "package/is/src/is"

export type Current<T> = { current: T }

function createCurrent<T>(init: T): [Current<T>, (next: T | (() => T)) => void] {
    const ref: Current<T> = { current: init }

    const setRef = (next: T | ((t: T) => T)) => {
        if (is.function(next)) {
            ref.current = next(ref.current)
        } else ref.current = next
    }

    return [ref, setRef]
}

export default createCurrent