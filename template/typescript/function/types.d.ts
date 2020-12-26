import { IncomingHttpHeaders } from "http"

export interface FnEvent {
   readonly body: string
   readonly headers: IncomingHttpHeaders
   readonly method: string
   readonly query: any
}

export interface FnResponse {
   headers?: any
   status?: number
   message?: any
}

type FnResult = FnResponse | string | null