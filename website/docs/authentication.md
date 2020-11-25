---
id: authentication
title: Authentication
---

## Auth Class
Auth class is a helper class to handle authentication process in your application. You should specify a driver and its
options in the [auth configuration](configuration.md#authentication) file and use its methods in your application. You
can import `Auth` class from `silvie/authentication`.

### Constructor
The constructor is just like an initializer which sets some internal properties for later use. You almost will never 
have to use the constructor method manually. There are other methods to do this instead.
- **payload** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **token** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **user?** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

The `payload` parameter is the authentication payload that is built or came from a token.
 
The `token` parameter is the authentication token which the client sent along with the request.

The `user` parameter is optional when creating a new auth instance, you may just set the user property if you want 
to access them all together.   

```typescript
import Auth from 'silvie/authentication';

const auth = new Auth(payload, token, user);
```

#### Auth.login()
This is a static method on the `Auth` class, which takes a payload object and returns a new Auth instance with a payload 
and token property. It will return null if anything goes wrong while trying to generate a token. 
- **payload** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```typescript
import Auth from 'silvie/authentication';

const auth = Auth.login({ type: 'user', id: 12 });

if (auth) {
    console.log(auth.token);
}
```

#### Auth.check()
This is a static method that will take a string token and sets the payload on the returning instance. It will return null if something 
goes wrong during the token validation and parsing.
- **token** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
import Auth from 'silvie/authentication';

// Read the token from the request
const token = 'A TOKEN THAT WAS SENT WITH THE REQUEST';

const auth = Auth.check(token);

if (auth) {
    console.log(auth.payload)
}
```

#### auth.logout()
This method will invalidate the token which is set on the current instance and returns a boolean if it was successful. 
Then you should terminate the user session or other things that needs to be done when a user has been logged out.

```typescript
import Auth from 'silvie/authentication';

const auth = Auth.check(token);

if (auth) {
    const isLoggedOut = auth.logout();
}
```
