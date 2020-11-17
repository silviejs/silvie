---
id: data-loaders
title: Data Loaders
---

GraphQL helps us build APIs faster, responds to many queries in a single request, you define a type system, and GraphQL
handles the rest. I'm going to hold you there for a second. 

What happens if there was a nested type structure? What happens if the client requests a complex nested query? Let's 
look at an example here:

You have a `Post` type, a `Comment` type and a `User` type.
- A Post has many Comments
- A Comment belongs to a User

Take a look at this GraphQL query:
```graphql
{
    posts {
        id
        title
        
        comments {
            id
            text
            
            user {
                id
                name
                picture
            }
        }
    }
}
```

Saying that we have 10 posts in our database, and each post has 20 comments. There will be **1** database query to fetch
all posts, then we go through each post and fetch comments for that specific post, which will require **10** queries to 
fetch the comments for all those 10 posts. Then you need a query for each comment to fetch its user, and yes, that needs
**200** database queries to get the job done. 211 queries for a single request is not a reasonable number. Data loaders
will address this very well. 

Silvie integrated [dataloader](https://www.npmjs.com/package/dataloader) package and used it in its GraphQL server.

## How It Works
Data loaders handle nested queries by batching queries of the same type in each level. They have a `load()` method that 
will accept a key, then it passes the collection of keys that need to be loaded to their callback function, and you need 
to map those keys to their corresponding data. 

## Creating Data Loaders
A data loader can be created manually if you know the exact syntax. Otherwise, you can 
[create one by using Silvie CLI](cli.md#make).

```bash
silvie make dataloader user
```

This command will create a file named `user.ts` in `src/graphql/dataloaders` directory of your project with the 
following content:

```typescript
import DataLoader from 'dataloader';

export default (): any => {
    return new DataLoader(async (keys: number[]) => {
        const results = keys.map((key: number) => {
            // Map keys with corresponding data

            return key;
        });

        return Promise.resolve(results);
    });
};
```

This command can be executed along with other entity maker commands like `model maker` or `schema maker` by passing an
extra `-d` or `--dataloader` option to those makers.

```bash
silvie make schema user -Mmsrd
# Creates model, migration, schema, resolver and data loader
# for the User entity
```

## Loading Data Loaders
You need to import all data loaders and pass them the main bootstrap function of Silvie. The data loaders collection 
should be assigned to `dataLoaders` property of the bootstrap function parameter.

```typescript
import bootstrap from 'silvie/bootstrap';

import schemas from 'graphql/schemas';
import resolvers from 'graphql/resolvers';
import dataLoaders from 'graphql/dataloaders';

bootstrap({ schemas, resolvers, dataLoaders });
```
 
## Using Data Loaders
The data loaders are accessible from `loaders` property of `context` parameter of a resolver. `context.loaders` property
is an object, which its keys are the filenames of your data loaders. For example if you have a `user.ts` in your data 
loaders directory, you can access it by `context.loaders.user`. 

This example will show you an example to fetch post comments.

```typescript
export default {
    // ...

    Post: {
        // ...

        comments({ id }, params, context): Promise<Comment[]> {
            return context.loaders.post_comments.load(id) as Promise<Comment[]>;
        }
        
        // ...
    }
    
    // ...
};
```

The `post_comments` data loader accepts a post id, and it is responsible to fetch an array of comments for that post.

As another example, You need to load the user who posted a comment for every single comment out there. This is done by 
the `user` data loader:
 
```typescript
export default {
    // ...

    Comment: {
        // ...

        user({ user_id }, params, context): Promise<User> {
            return context.loaders.user.load(user_id) as Promise<User>;
        }
        
        // ...
    }
    
    // ...
};
```

You give the data loader the `user_id` of each comment, and the data loader should return a user for the id passed to 
it.  

## Fetching Data
Data loader will give you an array of keys that you gave it earlier in your resolver, and expects you to fetch a value 
for each on of those keys. 

The following data loader will load all comments of a post by using a collection of their post ids.

```typescript
import DataLoader from 'dataloader';
import Comment from 'models/comment';

export default (): any => {
    // Given a collection of keys which are post ids
    return new DataLoader(async (keys: number[]) => {
        // Load all comments related to the keys
        const comments = await Comment.whereIn('post_id', keys).get();

        // Map each post id to its corresponding comments
        const results = keys.map((key: number) => {
            return comments.filter(comment => comment.post_id === key);
        });

        return Promise.resolve(results);
    });
};
```


The following data loader will handle loading users by a collection of their ids:

```typescript
import DataLoader from 'dataloader';
import User from 'models/user';

export default (): any => {
    // Given a collection of keys which are user ids
    return new DataLoader(async (keys: number[]) => {
        // Load all user with those ids
        const users = await User.whereIn('id', keys).get();

        // Map each id to its corresponding user
        const results = keys.map((key: number) => {
            return users.find(user => user.id === key);
        });

        return Promise.resolve(results);
    });
};
```

Data loaders will reduce a significant amount of data base requests. Try to use them in order to increase your 
application performance.
