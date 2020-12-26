# Advanced Async Templates for OpenFaaS

A collection of modern, opinionated, templates for various languages.

These templates all make use of [of-watchdog](https://github.com/openfaas-incubator/of-watchdog) in conjunction with a fast, asynchronous REST framework.  The images all all based on Alpine Linux and strive to use the latest stable versions of the underlying technologies.

To get started using the templates you can run:

```shell
faas-cli template pull https://github.com/fbriden/openfaas-aat
```

and then follow the instructions for the specific language below

## TypeScript
---

After the templates are installed, you can create a new function with:

```shell
faas-cli new hello-world --lang typescript
```

handler functions need to have a format like:

```typescript
import { FnEvent, FnResult } from "./types"

export default async function(event: FnEvent): Promise<FnResult> {
   // do something
}
```

The function result can be a structure like:

```typescript
   return {
      message: 'Hello world',
      status:  202
   }
```

a string like:

```typescript
   return 'Hello world'
```

or just `null`