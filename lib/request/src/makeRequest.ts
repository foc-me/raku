import type { FetchOption, FetchConfig } from "./refrece"
import is from "lib/is/src/is"

function makeUrl(url: string, param: object | undefined, option: Partial<FetchOption>): string {
    const { base } = option
    const target = /^http.*/.test(url || "") || is.nilEmpty(base) ? url : `${base}${url}`
    const paramFormat = Object.entries(param || {}).reduce((result, [key, value]) => {
        return `${result}${result ? "&" : ""}${key}=${value}`
    }, "")
    if (is.nilEmpty(paramFormat)) return target
    return `${target}${/\?/.test(target) ? "&" : "?"}${paramFormat}`
}

function mergeHeaders(source: Headers, target: Headers) {
    const entries = source.entries()
    let next = entries.next()
    while (!next.done) {
        const [key, value] = next.value
        target.append(key, value)
        next = entries.next()
    }
    return target
}

function mergeObjectHeaders(source: object, target: Headers) {
    const entries = Object.entries(source)
    for (const [key, value] of entries) {
        target.append(key, value)
    }
    return target
}

function makeHeaders(source: Headers | object | undefined, target: Headers | object | undefined): Headers {
    const nextHeaders = new Headers()
    if (is.headers(source)) mergeHeaders(source, nextHeaders)
    else if (is.object(source)) mergeObjectHeaders(source, nextHeaders)
    if (is.headers(target)) mergeHeaders(target, nextHeaders)
    else if (is.object(target)) mergeObjectHeaders(target, nextHeaders)
    return nextHeaders
}

function makeBody(body: undefined | object | string | BodyInit): BodyInit | undefined {
    try {
        if (is.nilEmpty(body)) return undefined
        if (is.bodyInit(body) || is.string(body)) return body
        return JSON.stringify(body)
    } catch (e) { throw e }
}

function makeRequest(config: Partial<FetchOption>, option: Partial<FetchConfig>): Request {
    const {
        url = "",
        param = undefined,
        body = undefined,
        headers = undefined,
        method = "get",
        ...others
    } = option
    const localUrl = makeUrl(url, param, config)
    const localHeaders = makeHeaders(config.headers, headers)
    const localBody = makeBody(body)
    const bodyIsFormData = body instanceof FormData
    if (bodyIsFormData && localHeaders) {
        localHeaders.delete("Content-Type")
    }

    return new Request(localUrl, {
        headers: localHeaders,
        body: localBody,
        method,
        ...others
    })
}

export default makeRequest