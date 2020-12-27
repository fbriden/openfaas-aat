# Typescript for OpenFaas

Makes use of [TS Node](https://github.com/TypeStrong/ts-node) bheind the scenes for compilation and execution.
Uses [Express](https://github.com/expressjs/express) for handling REST requests

## Usage

New functions can be created through the faas-cli like:

```shell
faas-cli new hello-world --lang typescript
```

The basic contract for the functions goes as follows:

 * The _handler_ function **must** be an async default export from the `handler.ts` file
 * The _handler_ function takes in _context_ and _event_ information and returns a promise of _result_ information
 * The _context_ contains relevant evironment variables and secrets that are known to the function
 * The _event_ contains the arguments for the function to process
 * The _result_ promise could contain a data structure, string message or just **null**

## Basics

A base-bones handler that does not care about the context could look like:

```typescript
import { FnContext, FnEvent, FnResult } from "./types"

export default async function(_: FnContext, event: FnEvent): Promise<FnResult> {
   // do something
   return null
}
```

A handler to create something something based on a dictionary of values could look like:

```typescript
import { FnContext, FnEvent, FnResult } from "./types"

export default async function(_: FnContext, event: FnEvent): Promise<FnResult> {
   const data = event.body
   // do something
   return null
}
```

A handler that needs a password (for a database connect, etc), does something and returns a simple message could look like:

```typescript
import { Connection } from 'somedb'
import { FnContext, FnEvent, FnResult } from "./types"

export default async function(context: FnContext, event: FnEvent): Promise<FnResult> {
   const connection = new Connection({
      username: context.secrets.get('username'),
      password: context.secrets.get('password')
   })

   // do something
   return 'ok'
}
```
