import is from "lib/is/src/is"

function copy<T>(target: T): T {
    if (is.nil(target)) return target
    if (is.array(target)) {
        return target.map(item => {
            return copy(item)
        }) as T
    }
    if (is.object(target)) {
        const result: any[] = []
        Object.entries(target).forEach(([key, value]) => {
            result.push({ [key]: copy(value) })
        })
    }
    return target

    // if (typeof target === "object") {
    //     if (target === null) return null;

    //     const result = [];
    //     if (Array.isArray(target)) {
    //         target.forEach(value => {
    //             result.push(copy(value));
    //         });
    //         return result;
    //     }

    //     const Constructor = localObject.find(constructor => {
    //         return constructor === target.constructor;
    //     });
    //     if (Constructor) {
    //         if ([Blob, File].includes(Constructor)) {
    //             const { name, type, lastModified } = target;
    //             const options = { type, lastModified };
    //             return new Constructor([target], name, options);
    //         } else {
    //             return new Constructor(target.valueOf());
    //         }
    //     }

    //     for (const key in target) {
    //         result.push({ [key]: copy(target[key]) });
    //     }
    //     Object.getOwnPropertySymbols(target).forEach(symbol => {
    //         result.push({ [symbol]: copy(target[symbol]) });
    //     });
    //     return result.length > 0 ? Object.assign.apply(null, result) : {};
    // } else return target;
}

export default copy