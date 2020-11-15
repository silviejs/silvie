---
id: controllers
title: Controllers
---

Silvie HTTP has been built on MVC structure. So you need to create controllers in order to respond to user requests. 
A controller is just an inherited class from the base `Controller` class. The base Controller class has no default 
behavior by itself. It is just used to detect controllers later at runtime.

## Creating a Controller
You can [create a new controller with Silvie CLI](cli.md#make). This command will create a controller named 
`ProductsController` in the `src/controllers` directory of your project.

```bash
silvie make controller ProductsController
```

A basic controller will look like this:

```typescript
import Controller from 'silvie/lib/http/controller';

export default class BasicController implements Controller {
    // Route Handlers
}
```

It is a default exported class inherited from `Controller`. You need to create route handlers in the class body.

## Loading Controllers
Controllers need to load at runtime. You need to load them all in the project bootstrap file, before calling the core
bootstrap function. 

```typescript
import 'controllers';
```

This type of import utilizes [babel-plugin-wildcard-import](https://www.npmjs.com/package/babel-plugin-wildcard-import) 
to import all files in a directory. Just importing the controllers will cause the method decorators to execute and 
register the route handlers in the application.

## Route Handlers
A route handler is a non-static method defined in a controller class, since they will be used as callback methods, 
they have two parameters which will be passed by the express server.
- **req**: [<Request\>](https://expressjs.com/en/5x/api.html#req)
- **res**: [<Response\>](https://expressjs.com/en/5x/api.html#res)

You can process the full request object with `req` and respond to the user with `res`. For more information about what
these objects are capable of, read the documentation for [Request](https://expressjs.com/en/5x/api.html#req) and 
[Response](https://expressjs.com/en/5x/api.html#res).

```typescript
import Controller, { route } from 'silvie/lib/http/controller';
import Post from 'models/post';

export default class BasicController implements Controller {
    @route('GET', '/posts')
    getPosts(req: any, res: any): void {
        if (req.secure) {
            Post.all().then((posts) => {
                res.send(posts);
            }).catch((error) => {
                res.status(500).send('Something bad happened in the server.');
            });
        } else {
            res.status(400).send('You need to use HTTPS to access this content.');
        }
    }
}
```

The example above, will send a `400` status code if the connection was not a TLS connection, and might send a `500` 
status code when it fails to fetch posts from the database. Otherwise, it will send all posts to the user.

