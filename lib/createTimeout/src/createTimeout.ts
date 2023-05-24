import createCompare from "lib/createCompare/src/createCompare"
import createCurrent from "lib/createCurrent/src/createCurrent"

function createTimeout() {
    const [time, updateTime] = createCurrent(Date.now())

    const checkTimeout = (delay: number) => {
        const { lt } = createCompare(delay)
        const current = Date.now()
        const timeout = current - time.current
        if (lt(timeout)) {
            updateTime(current)
            return true
        } return false
    }

    const duration = () => Date.now() - time.current
    const setTime = updateTime(Date.now())

    checkTimeout.duration = duration
    checkTimeout.setTime = setTime
    return checkTimeout
}

export default createTimeout