import type { FetchConfig, FetchOption, FetchAction, FetchRequest, FetchResponse } from "./request.d"
import createCurrent from "lib/createCurrent/src/createCurrent"
import is from "lib/is/src/is"
import merge from "lib/merge/src/merge"
import copy from "lib/copy/src/copy"
import makeRequest from "./makeRequest"
import makeResponse from "./makeResponse"

function provide(config: Partial<FetchOption> = {}) {
    if (!fetch) throw new ReferenceError("fetch is not defined")
    const [fetchConfig, setFetchConfig] = createCurrent(copy(config))
    const [fetchAction, setFetchAction] = createCurrent<Partial<FetchAction>>({})
    const useRequest = (request: (request: Request) => Request) => {
        setFetchAction(prev => {
            const { response } = prev
            return { request, response }
        })
    }
    const useResponse = (response: (response: FetchResponse) => FetchResponse) => {
        setFetchAction(prev => {
            const { request } = prev
            return { request, response }
        })
    }
    const request: FetchRequest = (option) => {
        const { request: requestCallback, response: responseCallback } = fetchAction.current
        let request = makeRequest(option, fetchConfig.current)
        request = is.function(requestCallback) ? requestCallback(request) : request
        return fetch(request).then(response => {
            let result = makeResponse(response)
            result = is.function(responseCallback) ? responseCallback(result) : result
            return result
        })
    }
    request.useConfig = setFetchConfig
    request.useRequest = useRequest
    request.useResponse = useResponse
    return request
}

function request(url: string | Partial<FetchConfig>, option: Partial<FetchConfig>) {
    const fetch = provide()
    option = is.string(url) ? merge({}, option, { url }) : option
    return fetch(option)
}

request.provide = provide

export default request