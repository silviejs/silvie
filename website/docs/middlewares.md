---
id: middlewares
title: Middlewares
---

Middlewares are useful when you want to handle some specific or all routes before they get to the route handler. Things
like authenticating the user, cleaning the request body, CSRF protection, etc, could be done by using middlewares.

## Creating a Middleware
A middleware is a class with a `handler` method which will be attached either to the HTTP server globally or to a single 
route. You can [create a new middleware with Silvie CLI](cli.md#make).

```bash
silvie make middleware auth
```

This command will create a `auth.ts` file in `src/middleware` of your project. The class name will be `AuthMiddleware` 
and adds the decorator to register it as the `auth` middleware. The result will be:

```typescript
import IMiddleware, { middleware } from 'silvie/http/middleware';

@middleware('auth')
export default class AuthMiddleware implements IMiddleware {
	handler(request: any, response: any, next: () => void): void {
		// Handle request here

		next();
	}
}
```

## Loading Middlewares
Since middlewares are being registered by decorators, You need to import them all before you call the core bootstrap 
function of Silvie.  

```typescript
import 'controllers';
```

This type of import utilizes [babel-plugin-wildcard-import](https://www.npmjs.com/package/babel-plugin-wildcard-import) 
to import all files in a directory. Just importing the controllers will cause the method decorators to execute and 
register the route handlers in the application.

## Middleware Decorator
There are some cases that you want a middleware to handle all requests that comes to your application. For example, a 
middleware to trim all request parameters that are being sent to the server. The `@middleware` decorator will register 
a class implementing `IMiddleware` as a middleware in your application. The registered middlewares do nothing by default 
in your application, until you assign them to a route or register them as global middlewares.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **global** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

This code will register a middleware with `csrf` name to be used later on the route handlers.
```typescript
import IMiddleware, { middleware } from 'silvie/http/middleware';

@middleware('csrf')
export default class CSRFMiddleware implements IMiddleware {
	handler(request: any, response: any, next: () => void): void {
		// Check for CSRF token in the request

		next();
	}
}
```

The following code will register the `trimmer` middleware as a global middleware, which will be fired on every request.

```typescript
import IMiddleware, { middleware } from 'silvie/http/middleware';

@middleware('trimmer', true)
export default class TrimmerMiddleware implements IMiddleware {
	handler(request: any, response: any, next: () => void): void {
		// Trim the strings in the request body

		next();
	}
}
```


## Middleware Handler
A middleware needs to implement a `handler` method which will be registered as the middleware handler later. The handler 
takes three parameters:
- **req**: [<Request\>](https://expressjs.com/en/5x/api.html#req)
- **res**: [<Response\>](https://expressjs.com/en/5x/api.html#res)
- **next**: [<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

In the handler method you need to process the incoming request and either send a response to the user or call the next
handler in the queue.

:::note Handler Queue
Middlewares and route handlers will be queued in as an array of handlers and will be called one by one when the route 
has triggered with a request.
:::

## Route Middlewares
Unless global middlewares that are being attached to all requests, You can specify one or more middlewares to execute on
a specific route handler. This is done by using the `@withMiddleware` decorator located at `silvie/http/controller`.

```typescript
import Controller, { route, withMiddleware } from 'silvie/http/controller';

export default class BooksController implements Controller {
    @route('PUT', '/register')
    @withMiddleware('csrf', 'no-auth')
    async getBook(req: any, res: any): void {
        // Handle the registration process

        res.send('Register Response');
    }
}
```

In this example we are adding `csrf` and `no-auth` middlewares to the `/register` route. When the client sends a request
to this route, the `csrf` middleware executes first and passes the request to the `no-auth` middleware and then the 
request will be passed to the route handler method. 

:::caution
Note that this decorator can only be used once on a route handler. If you use it more, it will overwrite the middlewares
that was set in the previous calls to this decorator. 
:::
