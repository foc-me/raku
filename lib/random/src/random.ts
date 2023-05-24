import createCurrent from "lib/createCurrent/src/createCurrent"

function lcg(seed: number){
    return (9301 * seed + 49297) % 233280
}

const create = (seed: number) => {
    const [randomSeed] = createCurrent(() => lcg(seed))
    return (max: number = 1, min: number = 0) => {
        return min + randomSeed.current * (max - min)
    }
}

function random(radix: number = 36) {
    return Math.random().toString(radix).substring(2)
}

random.create = create

export default random