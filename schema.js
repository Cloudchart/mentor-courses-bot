import fs from 'fs'
import path from 'path'
import Schema from './graphql/schema'
import { graphql } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'

graphql(Schema, introspectionQuery)
  .then(result => {
    fs.writeFileSync(path.join(__dirname, 'graphql/schema.json'), JSON.stringify(result, null, 2))
    fs.writeFileSync(path.join(__dirname, 'graphql/schema.graphql'), printSchema(Schema))
  })
