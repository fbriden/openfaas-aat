// Copyright (c) Fred Briden 2020.  All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2020. All rights reserved.
// Copyright (c) Alex Ellis 2017. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import bodyParser = require('body-parser')
import express = require('express')
import fs = require('fs')
import path = require('path')

import handler from './function/handler'
import { FnContext, FnResult } from './function/types'

// Basic setup of our REST handler
const app = express()
app.disable('x-powered-by')

// Port we'l be listening on for REST calls
const port = process.env.http_port || 3000

// Set up our incoming data processor
if (process.env.RAW_BODY === 'true') {
   app.use(bodyParser.raw({ type: '*/*' }))
} else {
   // Set up JSON processing - giving ourselves limits & error handling
   var limit = process.env.MAX_JSON_SIZE || '100kb' //body-parser default
   app.use(bodyParser.json({ limit }))
   app.use((err: Error, _: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err) { res.status(400).send(err.message) }
      else { next() }
   })

   app.use(bodyParser.raw()) // "Content-Type: application/octet-stream"
   app.use(bodyParser.text({ type : "text/*" }))
}

// Find environment variables
let environment: Map<string, string> = Object
   .entries(process.env)
   .reduce((a, [key, value]) => a.set(key.toUpperCase(), value || ''), new Map<string, string>())

// Find any secrets we might have that we want to pass on
let secrets = new Map<string, string>()
try {
   const folder = '/var/openfaas/secrets'
   fs.readdirSync(folder).filter(file => !file.startsWith('.')).forEach(file => {
      try {
         secrets.set(file, fs.readFileSync(path.join(folder, file), 'utf8'))
      } catch (e) {
         console.log(`Skipping secret ${file}: ${e.message}`)
      }
   })
} catch (e) {
   console.log('No secrets found for functions')
}

// Set up the function's context
const context: FnContext = { secrets, environment }

// Route all incoming traffic to the function
app.all('/*', async (req: express.Request, res: express.Response) => {
   try {
      let result: FnResult = await handler(context, {
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
