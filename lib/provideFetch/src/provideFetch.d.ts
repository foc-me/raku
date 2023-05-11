export type FetchOption = {
    base: string
    headers: Headers
}

export type FetchConfig = {
    url: string
    method: string
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

export interface FetchRequest {
    (option: Partial<FetchConfig>): Promise<FetchResponse>
    useConfig: (...args: any[]) => unknown
}