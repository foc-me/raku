import type { FetchConfig, FetchResponse } from "lib/provideFetch/src/provideFetch.d"
import provideFetch from "lib/provideFetch/src/provideFetch"
import is from "lib/is/src/is"

export type FetchRequest = ReturnType<typeof provideFetch>
export type ResponseFormatter = (response: FetchResponse) => unknown

function createFetch({ request }: FetchRequest, callback?: ResponseFormatter) {
    if (!request) throw new ReferenceError("request is not defined")

    const localRequest: (option: Partial<FetchConfig>) => Promise<any> = (option) => {
        return request(option).then((response) => {
            if (is.function(callback)) return callback(response)
            return response
        })
    }

    const fetchGet = (url: string, body?: object, option?: object) => {
        return localRequest({ url, method: "get", body, ...(option || {}) })
    }

    const fetchPost = (url: string, body?: object | BodyInit, option?: object) => {
        return localRequest({ url, method: "post", body, ...(option || {}) })
    }

    const fetchPut = (url: string, body?: object | BodyInit, option?: object) => {
        return localRequest({ url, method: "put", body, ...(option || {}) })
    }

    const fetchDelete = (url: string, body?: object, option?: object) => {
        return localRequest({ url, method: "delete", body, ...(option || {}) })
    }

    return {
        get: fetchGet,
        post: fetchPost,
        put: fetchPut,
        delete: fetchDelete,
        useConfig: request.useConfig
    }
}

export default createFetch