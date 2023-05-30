export enum BaseType {
    undefined = "Undefined",
    null = "Null",
    string = "String",
    number = "Number",
    bool = "Boolean",
    function = "Function",
    date = "Date",
    regexp = "RegExp",
    object = "Object",
    array = "Array",
    symbol = "Symbol",
    file = "File",
    blob = "Blob",
    set = "Set",
    map = "Map",
    weakset = "WeakSet",
    weakmap = "WeakMap"
}

export type NativeSubject = ((...args: any[]) => unknown) | Date | RegExp | Set<any> | Map<any, any> | WeakSet<any> | WeakMap<any, any> | File | Blob

function makeType(type: BaseType): string {
    return `[object ${type}]`
}

function isTypeOf(target: any): string {
    return Object.prototype.toString.call(target)
}

function is(target: any, type: BaseType): boolean {
    return isTypeOf(target) === makeType(type)
}

function checkAction(target: any, action: ((target: any) => boolean)[]): boolean {
    return action.reduce((res, current) => {
        return res && current(target)
    }, true)
}

function isString(target: any): target is string {
    return is(target, BaseType.string)
}

function isNumber(target: any): target is number {
    return is(target, BaseType.number) && !isNaN(target)
}

function isBool(target: any): target is boolean {
    return is(target, BaseType.bool)
}

function isNativeBase(target: any): target is string | number | boolean {
    return isString(target) || isNumber(target) || isBool(target)
}

function isFunction(target: any): target is ((...args: any[]) => unknown) {
    return is(target, BaseType.function) || typeof target === "function"
}

function isDate(target: any): target is Date {
    return is(target, BaseType.date)
}

function isRegExp(target: any): target is RegExp {
    return is(target, BaseType.regexp)
}

function isNativeObject(target: any): target is ((...args: any[]) => unknown) | Date | RegExp {
    return checkAction(target, [isFunction, isDate, isRegExp])
}

function isSymbol(target: any): target is symbol {
    return is(target, BaseType.symbol)
}

function isObject(target: any): target is object {
    return is(target, BaseType.object)
}

function isArray(target: any): target is Array<any> {
    return is(target, BaseType.array)
}

function isSet(target: any): target is Set<any> {
    return is(target, BaseType.set)
}

function isMap(target: any): target is Map<any, any> {
    return is(target, BaseType.map)
}

function isWeakSet(target: any): target is WeakSet<any> {
    return is(target, BaseType.weakset)
}

function isWeakMap(target: any): target is WeakMap<any, any> {
    return is(target, BaseType.weakmap)
}

function isNativeSetMap(target: any): target is Set<any> | Map<any, any> | WeakSet<any> | WeakMap<any, any> {
    return checkAction(target, [isSet, isMap, isWeakSet, isWeakMap])
}

function isFile(target: any): target is File {
    return is(target, BaseType.file)
}

function isBlob(target: any): target is Blob {
    return is(target, BaseType.blob)
}

function isNativeFile(target: any): target is Blob | File {
    return checkAction(target, [isFile, isBlob])
}

function isPromise(target: any): target is Promise<any> {
    return target.constructor === Promise
}

function isNil(target: any): target is undefined | null {
    // isNaN({ a: "safds" }) returns true
    return target === undefined || target === null
}

function isNilEmpty(target: any): target is undefined | null | "" {
    return isNil(target) || target === ""
}

function isNativeSubject(target: any): target is NativeSubject {
    return checkAction(target, [isFunction, isDate, isRegExp, isSet, isMap, isWeakSet, isWeakMap, isBlob, isFile])
}

function isNilObject(target: any): target is object {
    if (!isObject(target) && !isArray(target)) return isNilEmpty(target)
    if (target.constructor && isNativeSubject(target)) return false
    if (isArray(target)) return target.length < 1
    for (const entry of Object.entries(target)) {
        const [, value] = entry
        if (!isNil(value)) return false
    }
    return true
}

function isBufferSource(target: any): target is BufferSource {
    return target instanceof ArrayBuffer
        || target instanceof Int8Array
        || target instanceof Uint8Array
        || target instanceof Uint8ClampedArray
        || target instanceof Int16Array
        || target instanceof Uint16Array
        || target instanceof Int32Array
        || target instanceof Uint32Array
        || target instanceof Float32Array
        || target instanceof Float64Array
        || target instanceof BigInt64Array
        || target instanceof BigUint64Array
        || target instanceof DataView
}

function isBodyInit(target: any): target is BodyInit {
    return target instanceof FormData
        || target instanceof URLSearchParams
        || isBufferSource(target)
        || target instanceof Blob
        || target instanceof ReadableStream
}

is.typeOf = isTypeOf
is.string = isString
is.number = isNumber
is.bool = isBool
is.function = isFunction
is.date = isDate
is.regExp = isRegExp
is.object = isObject
is.symbol = isSymbol
is.array = isArray
is.set = isSet
is.map = isMap
is.weakSet = isWeakSet
is.weakMap = isWeakMap
is.file = isFile
is.blob = isBlob
is.promise = isPromise
is.nil = isNil
is.nilEmpty = isNilEmpty
is.nilObject = isNilObject
is.nativeBase = isNativeBase
is.nativeObject = isNativeObject
is.nativeFile = isNativeFile
is.nativeSubject = isNativeSubject
is.nativeSetMap = isNativeSetMap
is.bodyInit = isBodyInit

export default is