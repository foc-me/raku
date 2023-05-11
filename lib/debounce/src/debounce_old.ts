import is from "lib/is/src/is"

export type DebounceOption = {
    once: boolean
    delay: number
    maxWait: number
    leading: boolean
    trailing: boolean
}

const defaultOption: DebounceOption = {
    once: false,
    delay: 0,
    maxWait: 0,
    leading: true,
    trailing: false
}

function debonuce(callback: (...args: any[]) => unknown, delay?: number | Partial<DebounceOption>, option?: Partial<DebounceOption>) {
    if (!is.function(callback)) {
		throw new TypeError('callback is not a function')
    }
    
    if (is.number(delay)) delay = { delay }
    else delay = delay || {}
    const localOption: DebounceOption = Object.assign({}, defaultOption, option, delay)
    if (localOption.trailing === true) localOption.leading = false
    if (localOption.maxWait < localOption.delay) localOption.maxWait = localOption.delay

	const { delay: optionDelay, maxWait = 0, leading = false, trailing = true } = localOption
	let timer: number | undefined
    let _this: any
    let _args: any[]
    let start: number
    let last: number

	if (!leading && !trailing) {
		throw new TypeError('leading or trailing must be true')
	}

	const startTimer = (fn: (...args: any[]) => unknown) => {
		return setTimeout(fn, optionDelay)
	}

	const clearTimer = () => {
		if (timer) clearTimeout(timer)
		timer = undefined
	}

	const checkoutMaxWait = () => {
		if (maxWait > 0) {
			last = last || start
			return new Date().getTime() - last >= maxWait
		} else return false
	}

	const leadingFunction = () => {
		let res
		if (!timer) {
			res = apply()
			timer = startTimer(clearTimer)
		}
		return res
	}

	const trailingFunction = () => {
		if (timer) clearTimer()
		timer = startTimer(apply)
	}

	const apply = () => {
		last = new Date().getTime()
		let res = callback.apply(_this, _args)
		return res
	}

	function debounced(this: any, ...args: any[]) {
		_this = this
		_args = args
		start = new Date().getTime()

		if (checkoutMaxWait()) return debounced.flush()
		else if (leading) return leadingFunction()
		else if (trailing) return trailingFunction()
	}
	debounced.cancel = function() {
		clearTimer()
	}
	debounced.flush = function() {
		clearTimer()
		timer = startTimer(clearTimer)
		return apply()
	}
	debounced.pending = function() {
		return !!timer
	}
	return debounced
}

export default debonuce