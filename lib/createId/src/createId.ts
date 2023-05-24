import createCurrent from "lib/createCurrent/src/createCurrent"
import random from "lib/random/src/random"
import is from "lib/is/src/is"

export type CreateIdOption = {
    sort: boolean
    seed: number
    max: number
    min: number
}

const defaultOption: Partial<CreateIdOption> = { sort: true }

function createId(option: Partial<CreateIdOption>) {
    const localOption = Object.assign({}, defaultOption, option)
    const { sort, seed, max, min = 0 } = localOption
    const next = random.create(seed || Date.now())
    const [code, setCode] = createCurrent(min)
    const nextCode = () => {
        if (sort) {
            setCode(prev => ++prev)
            return code.current
        } else {
            if (is.number(max)) return Math.floor(Math.random() * (max - min) + min)
            return Math.floor(Math.random() + min)
        }
    }

    return () => {
        const code = nextCode()
        return next(code)
    }
}

export default createId