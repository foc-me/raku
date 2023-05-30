import type { FetchConfig, FetchOption, FetchActionRequest, FetchActionResponse, FetchResponse, UseConfig, UseRequest, UseResponse, FetchRequstUse } from "lib/request/src/refrece"
import request from "lib/request/src/request"

export enum UseType {
    request = "request",
    response = "request"
}

export type UseFetchAction = (type: UseType, callback: FetchActionRequest | FetchActionResponse) => unknown
export interface CreateFetch {
    (option: Partial<FetchConfig>): Promise<FetchResponse>
    useConfig: UseConfig
    useRequest: UseRequest
    useResponse: UseResponse
    use: FetchRequstUse,
    get: (url: string, param?: object, option?: object) => Promise<FetchResponse>
    post: (url: string, body?: object, option?: object) => Promise<FetchResponse>
    put: (url: string, body?: object, option?: object) => Promise<FetchResponse>
    delete: (url: string, param?: object, option?: object) => Promise<FetchResponse>
}

function createFetch(option: Partial<FetchOption>) {
    const requestFunction = request.provide(option)

    const useConfig: UseConfig = (...args) => requestFunction.useConfig(...args)
    const useRequest: UseRequest = (...args) => requestFunction.useRequest(...args)
    const useResponse: UseResponse = (...args) => requestFunction.useResponse(...args)
    const use: FetchRequstUse = (...args) => requestFunction.use(...args)

    const fetch: CreateFetch = (option) => {
        return requestFunction(option)
    }

    const fetchGet = (url: string, param?: object, option?: object) => {
        return fetch({ url, method: "get", param, ...(option || {}) })
    }
    const fetchPost = (url: string, body?: object | BodyInit, option?: object) => {
        return fetch({ url, method: "post", body, ...(option || {}) })
    }
    const fetchPut = (url: string, body?: object | BodyInit, option?: object) => {
        return fetch({ url, method: "put", body, ...(option || {}) })
    }
    const fetchDelete = (url: string, param?: object, option?: object) => {
        return fetch({ url, method: "delete", param, ...(option || {}) })
    }

    fetch.useConfig = useConfig
    fetch.useRequest = useRequest
    fetch.useResponse = useResponse
    fetch.use = use
    fetch.get = fetchGet
    fetch.post = fetchPost
    fetch.put = fetchPut
    fetch.delete = fetchDelete

    return fetch
}

export default createFetch