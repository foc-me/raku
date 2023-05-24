import type { FetchOption, FetchConfig } from "./request.d"
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

function makeHeaders(headers: Headers | undefined, option: Partial<FetchOption>): Headers | undefined {
    if (headers && option.headers) {
        const entries = option.headers.entries()
        let next = entries.next()
        while (!next.done) {
            const [key, value] = next.value
            headers.append(key, value)
            next = entries.next()
        }
        return headers
    }
    return headers || option.headers
}

function makeBody(body: undefined | object | string | BodyInit): BodyInit | undefined {
    try {
        if (is.nilEmpty(body)) return undefined
        if (is.bodyInit(body) || is.string(body)) return body
        return JSON.stringify(body)
    } catch (e) { throw e }
}

function makeRequest(config: Partial<FetchConfig>, option: Partial<FetchOption>): Request {
    const {
        url = "",
        param = undefined,
        body = undefined,
        headers = undefined,
        method = "get",
        ...others
    } = config

    const localUrl = makeUrl(url, param, option)
    const localHeaders = makeHeaders(headers, option)
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