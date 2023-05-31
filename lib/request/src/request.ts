import type { FetchConfig, FetchOption, FetchRequest, UseConfig, UseRequest, UseResponse, FetchRequestOption, FetchRequstUse, UseActionConfig, FetchActionRequest, FetchActionResponse } from "./refrece"
import { FetchRequestUseType } from "./refrece"
import createCurrent from "lib/createCurrent/src/createCurrent"
import is from "lib/is/src/is"
import merge from "lib/merge/src/merge"
import copy from "lib/copy/src/copy"
import makeRequest from "./makeRequest"
import makeResponse from "./makeResponse"

function provide(option: Partial<FetchOption> = {}) {
    if (!fetch) throw new ReferenceError("fetch is not defined")

    const [localOption, setOption] = createCurrent<Partial<FetchRequestOption>>({ option: copy(option) })
    const fetchRequest: FetchRequest = (option) => {
        const { option: currentOption, request: requestCallback, response: responseCallback } = localOption.current
        let request = makeRequest(currentOption || {}, option)
        request = is.function(requestCallback) ? requestCallback(request) : request
        return fetch(request).then(response => {
            let result = makeResponse(response)
            result = is.function(responseCallback) ? responseCallback(result) : result
            return result
        })
    }

    const useConfig: UseConfig = (next) => {
        setOption(prev => {
            if (is.function(next)) {
                const nextConfig = next(prev.option || {})
                return { ...prev, option: nextConfig }
            }
            return { ...prev, option: next }
        })
        return fetchRequest
    }

    const useRequest: UseRequest = (request) => {
        setOption(prev => ({ ...prev, request }))
        return fetchRequest
    }

    const useResponse: UseResponse = (response) => {
        setOption(prev => ({ ...prev, response }))
        return fetchRequest
    }

    const use: FetchRequstUse = (type, callback) => {
        if (!callback) return fetchRequest
        if (type === FetchRequestUseType.config) return useConfig(callback as UseActionConfig)
        if (type === FetchRequestUseType.request) return useRequest(callback as FetchActionRequest)
        if (type === FetchRequestUseType.response) return useResponse(callback as FetchActionResponse)
        return fetchRequest
    }

    fetchRequest.useConfig = useConfig
    fetchRequest.useRequest = useRequest
    fetchRequest.useResponse = useResponse
    fetchRequest.use = use

    return fetchRequest
}

function request(url: string | Partial<FetchConfig>, config: Partial<FetchConfig>) {
    const fetch = provide()
    config = is.string(url) ? merge({}, config, { url }) : config
    return fetch(config)
}

request.provide = provide

export default request