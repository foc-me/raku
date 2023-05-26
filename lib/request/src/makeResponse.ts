import type { FetchResponse } from "./request.d"

function makeBody(response: Response): any {
    const { body, headers } = response
    const contentType = headers.get("Content-Type") || ""
    if (contentType.includes("application/octet-stream")) {
        return response.blob()
    }
    if (contentType.includes("application/json")) {
        return response.json()
    }
    return body
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