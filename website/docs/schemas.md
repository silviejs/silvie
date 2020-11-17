---
id: schemas
title: Schemas
---

The first essential thing to a GraphQL server is the schemas to define the type system of your application. You define
Types, Queries, Mutations, etc in a schema. Schema files must be stored in the `src/graphql/schemas` directory of your
project. 

## Loading Schemas
You need to load them at runtime, so they will be transpiled to their JS object notation and pass them to the
main Silvie bootstrap function. It must be assigned to an object property named `schemas` like this: 

```typescript
import bootstrap from 'silvie/bootstrap';

import schemas from 'graphql/schemas';
import resolvers from 'graphql/resolvers';
import dataLoaders from 'graphql/dataloaders';

bootstrap({ schemas, resolvers, dataLoaders });
```

A schema file is file with `.gql` or `.graphql` extension. Entities in schema files need to be defined with the 
[GraphQL Type Language](https://graphql.org/learn/schema/#type-language). 

Since this is not a tutorial about the GraphQL type language, we do not focus on what it is capable of. You can learn 
more about it in [GraphQL Schemas and Types](https://graphql.org/learn/schema/) on its 
[official website](https://graphql.org).

## Creating Schemas
You can either create a `.gql` file by your self and start writing everything from scratch, or 
[create a schema using the Silvie CLI](cli.md#make).

```bash
silvie make schema Book
```

This will result into a file named `book.gql` in the `src/graphql/schemas` directory with a `Book` type and two queries
to fetch a single book and all books.

```graphql
type Book {
        id: Int!
}

extend type Query {
        book(id: Int!): Book
        books: [Book]
}
```

Note that if you are building your system on GraphQL, You can create schemas and resolvers when you are creating 
entities. For example, the following command will create a **Book model**, a **books migration**, a
**book schema** and a **book resolver**.

```bash
silvie make model Book --migration --schema --resolver

# Short form
silvie make model Book -msr
```

## Defining Type
A GraphQL type will be identified with the `type` keyword followed by the type name. The properties will be specified in
a pair of curly braces.

### Default Types
GraphQL comes with a few basic data types ([according to official docs](https://graphql.org/learn/schema/#scalar-types)) 
which you can use without any configuration:
- **Int**: Signed 32-bit integer
- **Float**: Signed double-precision floating-point value
- **String**: Signed UTF-8 Character sequence
- **Boolean**: `true` or `false`
- **ID**: An scalar type representing a unique identifier. It
 
### Built-in Types
Also, Silvie has a couple of useful built-in types in case you need to use them in your application. Keep in mind that 
you need to enable `Upload` and `JSON` types if you want to use them. [GraphQL Configuration](configuration.md#graphql) 
tells your more about enabling these types.
- **Query**: A wrapper to contain all your queries
- **Mutation**: A wrapper to contain all your mutations
- **Upload**: Represents a [Upload](graphql.md#upload) value
- **File**: Represents a [File](graphql.md#file) value
- **JSON**: Represents any valid [JSON](graphql.md#json) value
- **JSONObject**: Represents a [JSON Object](graphql.md#jsonobject) value

An example type would be like this:

```graphql
type Book {
    id: ID!

    title: String!
    author: String!
    ISBN: String!

    rating: Float!
}
```

## Creating a Query
A GraphQL query should be defined in the `Query` type. GraphQL allows you to add methods and properties to your types by
extending them. This will help you split your GraphQL schemas into separate files. Silvie implemented an empty Query 
type behind the scenes. So you just need to extend the query type and add your query definitions. 

The following query will take no parameters and returns an array of `User`s as the result:
```graphql
extend type Query {
    users: [Users]
}
```

The following query will take a `key` to search for and returns an array of `SearchResult` as the result, which is a 
union of `Books` and `Movies`:

```graphql
union SearchResult = Book | Movie

extend type Query {
    search(key: String!): [SearchResult]
}
```

## Creating a Mutation
Mutations are another kind of queries that are meant to be used for manipulating the data on the server. They should be 
defined in the `Mutation` type. Silvie also creates an empty `Mutation` type when it is initializing the GraphQL server
to let you add your mutations by extending the type.

This is an example of a mutation that takes user credentials and returns the login results as a `JSONObject` in the 
response:

```graphql
extend type Mutation {
    login(username: String!, pasword: String!): JSONObject!
}
```
