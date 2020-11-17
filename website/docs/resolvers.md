---
id: resolvers
title: Resolvers
---

A resolver is a method that tries to return data for different schema parts such as queries, mutations and computed 
fields. A resolver file is a `.ts` file that returns an object aka `Root Object`. The root object is an object that was 
split into separate resolver files. The fractions will be deep merged into a single object before being passed to the 
GraphQL server.
 
The root-level properties of this object should be the type names (e.g. Query, Mutation, Book, etc), which each of them 
are objects containing methods for their corresponding query or mutation or field names.

## Creating resolvers
Resolvers can be made manually by creating a `.ts` file manually, or by [using the make command in Silvie CLI](cli.md#make). 
This command will create a `user.ts` file in the `src/graphql/resolvers` directory of your project.

```bash
silvie make resolver user
```

The make command assumes that you are making a resolver to handle the `User Model`, so it will import the `User Class`, 
and adds two base methods to fetch them from the database. The contents of the file will be:

```typescript
import User from 'models/user';

class UserResolver {
	static user(obj, { id }): Promise<User> {
		return User.find(id) as Promise<User>;
	}

	static users(): Promise<User[]> {
		return User.all() as Promise<User[]>;
	}
}

export default {
	Query: {
		user: UserResolver.user,
		users: UserResolver.users,
	},
};
```

The resolvers defined as static class methods, then assigned to object properties and exported. This approach will let 
you build your resolver in an object oriented manner. 

However, you can always define your resolvers directly into the default exported object.

## Loading Resolvers
The resolvers should be loaded at runtime. This is done by importing them all from their directory and passing them to
the main Silvie bootstrap function. They need to be assigned to the `resolver` property of the bootstrap 
parameter.

```typescript
import bootstrap from 'silvie/bootstrap';

import schemas from 'graphql/schemas';
import resolvers from 'graphql/resolvers';
import dataLoaders from 'graphql/dataloaders';

bootstrap({ schemas, resolvers, dataLoaders });
```

## Resolver Methods
A resolver is a method that will accept 4 parameters:
- **obj**: The parent object
- **params**: The parameters that was passed to the query or mutation
- **context**: Context of GraphQL server which is being shared across all resolvers
- **info**: Field-specific information that is related to the current query and schema details

It returns some data to be set as the result of the query. 

Assuming, we have created a schema as follows:

```graphql
type User {
    id: Int!

    firstname: String!
    lastname: String!
    fullname: String!

    age: Int!
}

extend type Query {
    user(id: Int!): User
    users: [User]
}

extend type Mutation {
    createUser(firstname: String!, lastname: String!, age: Int!): Boolean!
}
```

So we have created a `User` type with some basic properties. 
Then we extended the `Query` type to add a query to fetch a user by its id, and a query to fetch all users at once.
We also have extended the `Mutation` type to create a mutation to create a new user. 

The following code examples will show you how you will define a resolver for each one.

### Query Resolvers
First you need to create a `user` resolver to resolve a single user:

```typescript {4-6,11}
import User from 'models/user';

class UserResolver {
    static user(obj, { id: number }): Promise<User> {
        return User.find(id) as Promise<User>;
    }
}

export default {
    Query: {
        user: UserResolver.user,
    }
}
```

:::note
When the client queries for a specific `user`, this resolver will be called and returns the user instance if it finds it. 
Otherwise, it will return null.
::: 

Then you need to create a method to fetch all users:

```typescript {6-8,15}
import User from 'models/user';

class UserResolver {
    ...

    static users(): Promise<User[]> {
        return User.all() as Promise<User[]>;
    }
}

export default {
    Query: {
        ...

        users: UserResolver.users
    }
}
```

Well, this will try to fetch all users from the database and returns an array of users whenever the client asks for the 
`users` query.

### Mutation Resolvers
Then you need to add a `Mutation` part to the exporting object and assign your mutation resolvers to it. Let's create a 
method to for the `createUser` mutation.

```typescript {6-23,29-31}
import User from 'models/user';

class UserResolver {
    ...

    static async createUser(
        obj, 
        { 
            firstname: string; 
            lastname: string; 
            age: int;
        }
    ): Promise<boolean> {
        // Do some validation

        const user = await User.create({
            firstname,
            lastname,
            age
        });

        return !!user;
    }
}

export default {
    ...

    Mutation: {
        createUser: UserResolver.createUser
    }
}
```

### Property Resolvers
You may have noticed a `fullname` property on the User type. That is a computed property which we are handling by a 
resolver on the User type. 

```typescript {6-8,14-16}
import User from 'models/user';

class UserResolver {
    ...

    static async fullname({ firstname, lastname }): Promise<string> {
        return `${firstname} ${lastname}`;
    }
}

export default {
    ...

    User: {
        fullname: UserResolver.fullname
    }
}
```

Note that we are using the first parameter of the resolver as it is being used on every user that needs the `fullname` 
property. We just take the `firstname` and `lastname` of the user, and return them joined by a white space.
