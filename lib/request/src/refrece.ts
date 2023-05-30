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

export enum FetchRequestUseType {
    config = "config",
    request = "request",
    response = "response"
}
export type FetchActionRequest = (request: Request) => Request
export type FetchActionResponse = (response: FetchResponse) => FetchResponse
export type FetchRequestConfig = {
    config: Partial<FetchOption>
    request: FetchActionRequest
    response: FetchActionResponse
}
export type UseActionSetConfig = (next: Partial<FetchOption>) => Partial<FetchOption>
export type UseActionConfig = Partial<FetchOption> | UseActionSetConfig
export type UseConfig = (next: UseActionConfig) => FetchRequest
export type UseRequest = (callback: FetchActionRequest) => FetchRequest
export type UseResponse = (callback: FetchActionResponse) => FetchRequest
export type FetchRequestUseAction = UseActionConfig | FetchActionRequest | FetchActionResponse
export type FetchRequstUse = (type: FetchRequestUseType, callback: FetchRequestUseAction) => FetchRequest

export interface FetchRequest {
    (option: Partial<FetchConfig>): Promise<FetchResponse>
    useConfig: UseConfig
    useRequest: UseRequest
    useResponse: UseResponse
    use: FetchRequstUse
}