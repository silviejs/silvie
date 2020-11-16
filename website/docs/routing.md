---
id: routing
title: Routing
---

Routing is one of the main concepts in back-end development. It is how we set addresses for our API endpoints. Silvie 
utilizes the power of `Method Decorators` to set an address for a method in a controller. This is meant to be as simple
as possible.

## Route Decorator
Route decorator is how you define your routes and attach them to your request handlers. It can be imported from the main
controller file located at `silvie/http/controller`.
 
```typescript
import Controller, { route } from 'silvie/http/controller';
```

The route decorator will take two parameters:
- **method** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **url** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

The method needs to be a string with the name of one of the methods mentioned in [HTTP Methods](#http-methods).


As you may already know, the decorators are some functions written before something to add a functionality to it, and 
they are marked with `@`.

```typescript
import Controller, { route } from 'silvie/http/controller';

export default class GreetingController implements Controller {
	@route('GET', '/say-hi')
	greeter(req: any, res: any): void {
		res.send('Hello From Silvie');
	}
}
```

The above code sample will attach the `greeter` method of `GreetingController` class to a `/say-hi` URL accessible by
using the `GET` method.

## HTTP Methods
Silvie has an underlying express server to handle HTTP requests. Therefore, the available HTTP verbs are:
- **Official Verbs**
  - DELETE
  - GET
  - HEAD
  - OPTIONS
  - PATCH
  - POST
  - PUT
  - TRACE
- **Unofficial Verbs**
  - CHECKOUT
  - COPY
  - LOCK
  - M-SEARCH
  - MERGE
  - MKACTIVITY
  - MKCOL
  - MOVE
  - NOTIFY
  - PURGE
  - REPORT
  - SEARCH
  - SUBSCRIBE
  - UNLOCK
  - UNSUBSCRIBE

There is also an `ALL` method, which can be used to respond to all request types from a request handler. It is just like 
you mount a middleware on that specific path. So there won't be a specific HTTP Verb attached to your request handler.

Note that all verbs mentioned above can also be used in lowercase, or any other case you may like. They will convert to
lowercase when they are being registered.

## Routes
### Basic
Basic Routes are some usual URLs without any parameters.

```typescript
import Controller, { route } from 'silvie/http/controller';
import Book from 'models/book';

export default class BooksController implements Controller {
    @route('PUT', '/books/sci-fi')
    async getBook(req: any, res: any): void {
        const book = await Book.create({
            title: req.body.title
        });

        res.send(book);
    }
    // Matches PUT on /books/sci-fi
}
```

### Wildcard
Wildcard routes add more flexibility to your application routes. 

#### ?
Using a question mark after a character or after a group of characters will make that part optional.
```typescript
@route('GET', '/hello?')
// Matches  /hell  /hello

@route('GET', '/h(el)?lo')
// Matches  /hlo  /hello
```

#### +
Using a plus sign after a character, will match URLs containing one or more of that character there.

```typescript
@route('GET', '/hello+')
// Matches  /hello  /helloo  /hellooooo

@route('GET', '/hel+o')
// Matches  /helo  /hello  /hellllo
```


#### *
Using an astrix sign after a character, will match URLs containing zero or more of that character there.

```typescript
@route('GET', '/hel*o')
// Matches  /heo  /helo /hellllo

@route('GET', '/hello*')
// Matches  /hell  /hello  /hellooooo
```

:::tip
Note that unlike the `?` operator, `+` and `*` won't work for character groups.
:::

There is also another usage of `*` operator which you can wildcard the whole route. This can be done by putting an 
astrix sign at the end of a routes trailing slash. The wildcard path that was matched using the `*` sign, will be 
accessible by `req.params[0]`;

```typescript
import Controller, { route } from 'silvie/http/controller';

export default class BooksController implements Controller {
    @route('GET', '/files/*')
    async getBook(req: any, res: any): void {
        console.log(req.params[0])

        res.send('Files Wildcard URL');
    }
    // Matches  /files/images  /files/images/avatar.png
}
```


### Regular Expression
You may pass a regular expression as the url to the route decorator for handling more advanced routes.

```typescript
import Controller, { route } from 'silvie/http/controller';

export default class BooksController implements Controller {
    @route('GET', /.*er$/)
    async getBook(req: any, res: any): void {
        res.send('Say hello to Regular Expressions');
    }
    // Matches  /er  /commander  /servicer/printer
}
```

## Route Parameters
It is sometimes necessary to define parameters in the URL. There are multiple types of parameters which you can specify
in a URL string.

### Basic
A basic route parameters is a name identified with a `:` prefix.

```typescript
import Controller, { route } from 'silvie/http/controller';
import Post from 'models/post';

export default class PostsController implements Controller {
    @route('GET', '/posts/:postId')
    async getPost(req: any, res: any): void {
        const post = await Post.find(req.params.postId);

        res.send(post);
    }
    // Matches  /posts/123  /posts/silvie-612
}
```

### Optional
You can make it optional with `?` sign after the parameter name.

```typescript
import Controller, { route } from 'silvie/http/controller';
import Post from 'models/post';

export default class PostsController implements Controller {
    @route('GET', '/posts/:postId?')
    async getPost(req: any, res: any): void {
        let data = null;

        if (req.params.postId) {
            data = await Post.find(req.params.postId);
        } else {
            data = await Post.all();
        }

        res.send(data);
    }
    // Matches  /posts  /posts/561  /posts/silvie-article
}
```

It there was a `postId` parameter in the url, will return with a post with a specific id. Otherwise, it will return all 
posts as the result.


### Regular Expression
You may also need more control over the parameters you define in the URL. So you can append a regular expression wrapped 
in a pair of parentheses.

```typescript
import Controller, { route } from 'silvie/http/controller';
import Post from 'models/post';

export default class PostsController implements Controller {
    @route('GET', '/posts/:postId(\d{3,})')
    async getPost(req: any, res: any): void {
        const post = await Post.find(req.params.postId);

        res.send(post);
    }
    // Matches  /posts/132  /posts/2751
}
```

This route will only respond to those request with a `postId` that has **3 or more digits**.


