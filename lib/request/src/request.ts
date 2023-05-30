import type { FetchConfig, FetchOption, FetchRequest, UseConfig, UseRequest, UseResponse, FetchRequestConfig, FetchRequstUse, UseActionConfig, UseActionSetConfig, FetchActionRequest, FetchActionResponse } from "./refrece"
import { FetchRequestUseType } from "./refrece"
import createCurrent from "lib/createCurrent/src/createCurrent"
import is from "lib/is/src/is"
import merge from "lib/merge/src/merge"
import copy from "lib/copy/src/copy"
import makeRequest from "./makeRequest"
import makeResponse from "./makeResponse"

function provide(option: Partial<FetchOption> = {}) {
    if (!fetch) throw new ReferenceError("fetch is not defined")

    const [config, setConfig] = createCurrent<Partial<FetchRequestConfig>>({ config: copy(option) })
    const fetchRequest: FetchRequest = (option) => {
        const { config: currentConfig, request: requestCallback, response: responseCallback } = config.current
        let request = makeRequest(option, currentConfig || {})
        request = is.function(requestCallback) ? requestCallback(request) : request
        return fetch(request).then(response => {
            let result = makeResponse(response)
            result = is.function(responseCallback) ? responseCallback(result) : result
            return result
        })
    }

    const useConfig: UseConfig = (next) => {
        setConfig(prev => {
            if (is.function(next)) {
                const nextConfig = next(prev.config || {})
                return { ...prev, config: nextConfig }
            }
            return { ...prev, config: next }
        })
        return fetchRequest
    }

    const useRequest: UseRequest = (request) => {
        setConfig(prev => ({ ...prev, request }))
        return fetchRequest
    }

    const useResponse: UseResponse = (response) => {
        setConfig(prev => ({ ...prev, response }))
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

function request(url: string | Partial<FetchConfig>, option: Partial<FetchConfig>) {
    const fetch = provide()
    option = is.string(url) ? merge({}, option, { url }) : option
    return fetch(option)
}

request.provide = provide

export default request