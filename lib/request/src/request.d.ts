import type { SetCurrent } from "lib/createCurrent/src/createCurrent"

export type FetchOption = {
    base: string
    headers: Headers
}

export type FetchConfig = {
    url: string
    method: string
    param: object,
    body: object | BodyInit
    headers: Headers
}

export type FetchResponse = {
    body: any
    bodyUsed: boolean
    headers: Headers
    ok: boolean
    redirected: boolean
    status: number
    statusText: string
    type: string
    url: string
    origin: Response
}

export type FetchActionRequest = (request: Request) => Request
export type FetchActionResponse = (response: FetchResponse) => FetchResponse
export type FetchAction = {
    request: FetchActionRequest,
    response: FetchActionResponse
}
export type UseRequest = (callback: FetchActionRequest) => unknown
export type UseResponse = (callback: FetchActionResponse) => unknown

export interface FetchRequest {
    (option: Partial<FetchConfig>): Promise<FetchResponse>
    useConfig: SetCurrent<Partial<FetchOption>>
    useRequest: UseRequest
    useResponse: UseResponse
}