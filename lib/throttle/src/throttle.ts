import type { DebounceCallback, DebounceConstructorCallback, DebounceOption } from "lib/debounce/src/debounce"
import debounce from "lib/debounce/src/debounce"
import is from "lib/is/src/is"

const defaultOption: Partial<DebounceOption> = {
    leading: true,
    trailing: false
}

function throttle(callback: DebounceCallback | DebounceConstructorCallback, delay?: Partial<DebounceOption> | number, option?: Partial<DebounceOption>) {
    if (is.number(delay)) delay = { delay }
    else delay = delay || {}
    option = Object.assign({}, defaultOption, delay, option)
    return debounce(callback, option)
}

export default throttle