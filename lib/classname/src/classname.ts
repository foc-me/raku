import is from "lib/is/src/is"

function classname(...classes: any[]): string {
    const result: string[] = classes.reduce((result, current) => {
        if (is.string(current) && current.trim().length > 0) {
            result.push(current)
        } else if (is.function(current)) {
            result.push(classname(current()))
        } else if (is.array(current) && current.length > 0) {
            result.push(classname(...current))
        } else if (is.object(current)) {
            Object.entries(current).forEach(([key, value]) => {
                if (classname(value)) result.push(key)
            })
        } else if (!!current === true) result.push(true)
        return result
    }, [])
    
    return result.filter(className => !is.nilEmpty(className)).join(" ")
}

export default classname