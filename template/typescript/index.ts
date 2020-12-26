// Copyright (c) Fred Briden 2020.  All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2020. All rights reserved.
// Copyright (c) Alex Ellis 2017. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import bodyParser = require('body-parser')
import express = require('express')
import handler from './function/handler'
import { FnResult } from './function/types'

const app = express()
const port = process.env.http_port || 3000

app.disable('x-powered-by');

if (process.env.RAW_BODY === 'true') {
   app.use(bodyParser.raw({ type: '*/*' }))
} else {
   var jsonLimit = process.env.MAX_JSON_SIZE || '100kb' //body-parser default

   app.use(bodyParser.json({ limit: jsonLimit}));
   app.use((err: Error, _: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err) { res.status(400).send(err.message) }
      else { next() }
   })

   app.use(bodyParser.raw()); // "Content-Type: application/octet-stream"
   app.use(bodyParser.text({ type : "text/*" }));
}

app.all('/*', async (req: express.Request, res: express.Response) => {
   try {
      let result: FnResult = await handler({
         body: req.body,
         headers: req.headers,
         method: req.method,
         query: req.query
      })

      if (!!result) {
         if (typeof(result) === 'string') { res.status(200).send(result) }
         else { res.set(result.headers || {}).status(result.status || 200).send(result.message) }
      } else {
         res.status(200).send(null)
      }
   } catch(e) {
      res.status(500).send(e.toString ? e.toString() : e)
   }
})
app.listen(port, () => console.log(`OpenFaaS Typescript listening on port: ${port}`))
