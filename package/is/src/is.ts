export enum BaseTypes {
    object = "Object",
    array = "Array",
    string = "String",
    number = "Number",
    bool = "Boolean",
    function = "Function",
    symbol = "Symbol"
}

const localObjects = [Date, RegExp, Function, Map, Set, WeakMap, WeakSet, Blob, File]

function makeType(type: BaseTypes): string {
    return `[object ${type}]`
}

function typeOf(target: any) {
    return Object.prototype.toString.call(target)
}

function is(target: any, type: BaseTypes) {
    return typeOf(target) === makeType(type)
}

function isObject(target: any): target is object {
    return is(target, BaseTypes.object)
}

function isArray(target: any): target is Array<any> {
    return is(target, BaseTypes.array)
}

function isString(target: any): target is string {
    return is(target, BaseTypes.string)
}

function isNumber(target: any): target is number {
    return is(target, BaseTypes.number) && !isNaN(target)
}

function isBool(target: any): target is boolean {
    return is(target, BaseTypes.bool)
}

function isFunction(target: any): target is ((...args: any[]) => unknown) {
    return is(target, BaseTypes.function) || typeof target === "function"
}

function isSymbol(target: any): target is symbol {
    return is(target, BaseTypes.symbol)
}

function isPromise(target: any): target is Promise<any> {
    return target.constructor === Promise
}

function isNil(target: any): target is undefined | null {
    return target === undefined || target === null
}

function isNilEmpty(target: any): target is undefined | null | "" {
    return isNil(target) || target === ""
}

function isNilObject(target: any): target is object {
    if (!isObject(target) && !isArray(target)) return isNilEmpty(target)
    if (target.constructor && localObjects.includes(target.constructor as any)) return false
    if (isArray(target)) return target.length < 1
    for (const entry of Object.entries(target)) {
        const [, value] = entry
        if (!isNil(value)) return false
    }
    return true
}

is.object = isObject
is.array = isArray
is.string = isString
is.number = isNumber
is.bool = isBool
is.function = isFunction
is.symbol = isSymbol
is.promise = isPromise
is.nil = isNil
is.nilEmpty = isNilEmpty
is.nilObject = isNilObject

export default is