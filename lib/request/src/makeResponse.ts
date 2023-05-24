import type { FetchResponse } from "./request.d"

function makeBody(response: Response): any {
    // const contentType = response.headers.get("Content-Type") || ""
    // if (/application\/json/.test(contentType)) return response.json()
    return response.json()
}

function makeResponse(response: Response): FetchResponse {
    return {
        body: makeBody(response),
        bodyUsed: response.bodyUsed,
        headers: response.headers,
        ok: response.ok,
        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url,
        origin: response
    }
}

export default makeResponse