import is from "lib/is/src/is"

function merge(target: any, ...sources: any[]) {
    sources.forEach(source => {
        Object.entries(source).forEach(([key, value]) => {
            if (is.object(target[key]) && is.object(value)) {
                target[key] = merge(target[key], value)
            } else target[key] = value
        })
    })

    return target
}

export default merge