import { FnContext, FnEvent, FnResult } from "./types"

export default async function(_: FnContext, event: FnEvent): Promise<FnResult> {
   const message = 'Received input: ' + JSON.stringify(event.body)

   return { message }
}