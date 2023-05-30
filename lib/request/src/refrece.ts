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
export type FetchRequestUseAction = UseActionConfig | FetchActionRequest | FetchActionResponse
export interface FetchRequest {
    (option: Partial<FetchConfig>): Promise<FetchResponse>
    useConfig: (next: UseActionConfig) => FetchRequest
    useRequest: (callback: FetchActionRequest) => FetchRequest
    useResponse: (callback: FetchActionResponse) => FetchRequest
    use: (type: FetchRequestUseType, callback: FetchRequestUseAction) => FetchRequest
}
export type UseConfig = (next: UseActionConfig) => FetchRequest
export type UseRequest = (callback: FetchActionRequest) => FetchRequest
export type UseResponse = (callback: FetchActionResponse) => FetchRequest
export type FetchRequstUse = (type: FetchRequestUseType, callback: FetchRequestUseAction) => FetchRequest