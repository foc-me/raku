export function isNil(target: any): target is undefined | null {
    return target === undefined || target === null
}

export function isNilEmpty(target: any) {
    return isNil(target) || target === ""
}