import { IncomingHttpHeaders } from "http"

/**
 * The context under which the function is being run.
 * 
 * Will contain information about things like environment variables and secrets.
 */
export interface FnContext {
   /**
    * A map of all known secrets the function has access to.
    * 
    * The keys will be based on secrets defined in OpenFaas here: https://docs.openfaas.com/reference/secrets/
    * 
    * NOTE - when using K8S secrets the keys here are the keys INSIDE the K8S secrets, not the name of the secret.
    *        For example - if there was a secret 'auth-tokens' inside k8s with keys 'user' and 'password', then
    *        the secret map here would have keys for 'user' and 'password' but not 'auth-tokens'.
    */
   readonly secrets: ReadonlyMap<string, string>

   /**
    * A map of environment variables the function has access to.
    * 
    * Might be filtered and not container EVERYTHING set by the environment.
    * All keys are normalized to be in UPPER CASE.  So if there was an environment variable 'password' then it would
    * be found under the key 'PASSWORD'
    */
   readonly environment: ReadonlyMap<string, string>
}

export interface FnEvent {
   readonly body: string | Object
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