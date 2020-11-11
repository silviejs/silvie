---
id: graphql
title: GraphQL Server
sidebar_label: GraphQL
---

[GraphQL](https://graphql.org) is a query language for APIs. It provides an efficient way of communication between the 
client and the server. Silvie makes it easy to configure and use a GraphQL server in your back-end application. You just
need to [enable the GraphQL](configuration.md#enabled) in its configuration file.

Silvie utilizes [apollo-server-express](https://www.npmjs.com/package/apollo-server-express) 
package to serve a GraphQL server. 

## Base Data Types
Silvie configures GraphQL to be modular. You can define your schema definitions and resolvers in their own directories.
When you are defining your type system in GraphQL you need to create several queries and mutations. Silvie defines a
base `Query` and a base `Mutation` type, so you can extend them later. 

:::info
The **Query** and **Mutation** types are enabled by default. But you need to enable **JSON** or **Upload** in the 
GraphQL configuration file.
:::

### Query
This type will contain your query method signatures. Queries are types of methods to fetch data and return with results.

### Mutation
This type will contain your mutation method definitions. Mutations are types of queries that might modify something on 
the server. 

Yes, you can also modify the server in a query, but it is a convention to use queries for fetching data and mutations 
for changing data. 

### Upload
If you enable file uploads in your GraphQL configuration file, Silvie will put 
[graphql-upload](https://www.npmjs.com/package/graphql-upload) package next to Apollo to handle uploaded files and pass
them to your resolvers, then, `Upload` and `File` types will be added to the main schema definition.

### File
This type comes along with the `Upload` type. If your GraphQL server is exchanging files, this type will help you to 
indicate a typical file with its typical properties. This is how the default definition is:

```graphql
type File {
	filename: String!
	mimetype: String!
	encoding: String!
}
```

### JSON
GraphQL is a type based system and everything needs to be typed. In the other hand, there are sometimes that you need to 
have more flexibility on your data. Then you should enable `JSON` type in GraphQL configuration file. This type will 
support any valid JSON data.   

### JSONObject
This type will be added with `JSON` type. `JSONObject` will only support a JSON object, which will throw an error when
you pass a non-object to variables of this kind. 


## Endpoint
GraphQL will be mounted as a middleware on a URL of your HTTP server and parses the incoming queries and responds to 
them. That URL is `/graphql` by default, but you can change it in the GraphQL configuration file.

## Middleware
There are some cases that you may need to process the request before sending it to GraphQL server. You can specify a
middleware by its name in the GraphQL configuration file to put it before GraphQL server. Note that middleware must 
exist in your project.

## Features
GraphQL has some features to ease the development process and makes testing your APIs easier than ever. 

### Playground
The GraphQL playground is a web interface made for testing the queries and mutations. It will be served on the same 
endpoint that you specified for the GraphQL. It is accessible from a web browser.

:::caution
It is recommended to disable the playground on production, since it may expose all of your definitions and queries to
everyone who visits that page, and this will be a security risk for those will low security measures in their codes.
:::

### Introspection
Introspection is a feature that comes with GraphQL to ask the GraphQL server what types and queries it supports. To 
learn more about this, read [Introspection](https://graphql.org/learn/introspection) on GraphQL official website.
