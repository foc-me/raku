import type { FetchOption, FetchRequest } from "./provideFetch.d"
import createCurrent from "lib/createCurrent/src/createCurrent"
import makeRequest from "./makeRequest"
import makeResponse from "./makeResponse"

function provideFetch(config: Partial<FetchOption> = {}) {
    if (!fetch) throw new ReferenceError("fetch is not defined")

    //:TODO need copy
    const [localConfig, setLocalConfig] = createCurrent(Object.assign({}, config))
    const request: FetchRequest = (option) => {
        const request = makeRequest(option, localConfig.current)
        return fetch(request).then(response => {
            return makeResponse(response)
        })
    }
    request.useConfig = setLocalConfig

    return { request }
}

export default provideFetch