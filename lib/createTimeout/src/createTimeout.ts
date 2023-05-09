import createCompare from "lib/createCompare/src/createCompare"
import createCurrent from "lib/createCurrent/src/createCurrent"

export function createTimeout() {
    const [time, setTime] = createCurrent(Date.now())

    const checkTimeout = (delay: number) => {
        const { lt } = createCompare(delay)
        const current = Date.now()
        const timeout = current - time.current
        if (lt(timeout)) {
            setTime(current)
            return true
        } return false
    }

    return checkTimeout
}

export default createTimeout