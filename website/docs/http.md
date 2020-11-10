---
id: http
title: HTTP Server
sidebar_label: HTTP
---

HTTP server is the core part of any back-end framework, including Silvie. It uses an instance of 
[Express](https://expressjs.com) as its underlying web server.

## Port Decision
Silvie goes through the following steps to choose a port number to run its HTTP server. 

1- Look for the `--port` in command line args
2- Look for the `-p` in command line args
3- Look for the `APP_PORT` in `.env` file
4- Look for the port number in HTTP configuration file

If port number could not be found in any of these steps, Silvie will take `5000` as its fallback port number.

## HTTPS
You can run your HTTP server on HTTPS protocol. Silvie uses Node.js default HTTPS module to serve the application over 
HTTPS. All you need to do is to enable **SSL** and provide **Certificate Files** in the 
[SSL part of your HTTP Configuration](configuration.md#ssl).

## HTTP/2
HTTP/2 has a lot to offer. It speeds the content serving up, by responding to multiple requests in parallel in a single
connection, compressing the headers, etc. Silvie is using [SPDY](https://www.npmjs.com/package/spdy) as the HTTP/2 
server. All you need to do is enabling it by setting the `http2` option to `true` in your HTTP configuration.

:::tip
Please note that you need to configure SSL, in order to make HTTP/2 work as expected.
:::

## CORS
CORS is the mechanism for a server to allow other origins than its own to request for restricted resources. This is done
by a request called **preflight**. A browser will make a preflight request with `OPTIONS` HTTP verb before requesting 
resources from other origins to see if it is permitted or not. Silvie uses [cors](https://www.npmjs.com/package/cors) 
package in combination with Express to achieve this behavior. You can read more about the CORS configuration options in 
the [CORS part of HTTP Configuration](configuration.md#cors) file. 

## Cookie
Cookies become handy when you want to share data between client sessions. It is usually used to store authentication 
tokens, user interests, session identifiers, etc. Silvie utilizes
[cookie-parser](https://www.npmjs.com/package/cookie-parser) package to work with cookies. All you need to do is to 
enable it and specify a secret for the cookie parser to secure the cookies. Find out more on 
[Cookie part of HTTP Configuration](configuration.md#cookie) file.

### Reading Cookies
When there you got a Request instance in your scope. You can access your parsed cookies with `cookies` parameter of that
instance. It will be an object containing your cookies with their corresponding keys. 

```typescript
import Controller, { route } from 'silvie/lib/http/controller';

class GreetingController implements Controller {
    @route('GET', '/greet')
    greeterRoute(req, res) {
        const { name } = req.cookies;
    
        if (name) {
            res.send(`Wassup, got some cookies ${name}?`);
        } else {
            res.send(`Who am I talking to?`);        
        }       
    }
}
```

So whenever a user who has cookies, goes to this route, we will respond with a message with their name. Otherwise, we 
return something else.

### Setting Cookies
Saying we are doing some authentication for our login page. In some cases you need to return the authentication token in
response cookies to be stored on the client side. You can create a cookie with `cookie` method of the response instance.
The cookie method will take three parameters: name, value and options. Which the value and options are optional 
parameters.

#### name
The first parameter will specify the name of that cookie.

#### [value]
The second parameter is the value to be set for the cookie. 

#### [options]
Cookie options are a few to indicate how the cookie should be stored or accessed later. Here are the list of acceptable 
options:
- **maxAge**: This will specify the maxAge of the cookie in `milliseconds`.
- **expires**: This is a `Date object` indicating when the cookie has to be expired.
- **path**: A string that shows the path of the cookie. This is `'/'` by default.
- **domain**: A string to specify the domain of the cookie.
- **secure**: Weather to only send cookies over HTTPS or not. By default, this will be `false` for HTTP, and `true` for HTTPS requests. 
- **httpOnly**: Weather to make the cookie only accessible from HTTP(S) requests and not from the client javascript.
- **sameSite**: Specify if the cookie is a *same site* cookie. This is false by default, but you can set it to `'strict'`, `'lax'` or `'none'`.
- **signed**: If this option will be true, it will add an extra cookie with `.sig` suffix to your cookies, which contains a SHA1 hash of the `cookie-name=cookie-value`, in order to detect tampered cookies next time it is being received.
- **overwrite**: This option will determine if cookies with the same name should be overwritten in the same request or not.

```typescript
import Controller, { route } from 'silvie/lib/http/controller';

class AuthenticationController implements Controller {
    @route('POST', '/login')
    handleLogin(req, res) {
        const { username, password } = req.body;        

        // Authentication process

        if (userIsValid) {
            res.cookie('access_token', 'YOU_NEED_TO_GENERATE_A_TOKEN_FOR_THE_USER', {
                maxAge: 7 * 24 * 60 * 60 * 1000, // expire after 7 days 
                secure: true,
                sameSite: false,
                httpOnly: true
            });            

            res.send('You are logged in');
        } else {
            res.send('Wrong username or password');
        }       
    }
}
```

### Deleting Cookies
Deleting cookies will have its own traditional way. You have to set the cookie again with an expiration date before the 
current date. It is recommended to set the expires attribute to a `0 Date Object`. You also have to set the same cookie 
attributes for that you have used to create it. 

```typescript
import Controller, { route } from 'silvie/lib/http/controller';

class AuthenticationController implements Controller {
    @route('GET', '/logout')
    handleLogout(req, res) {
        // Logut process

        res.cookie('access_token', null, {
            expires: new Date(0),
            secure: true,
            sameSite: false,
            httpOnly: true
        });            

        res.send('You are logged out');
    }
}
```


## Session
In most of back-end applications, working with sessions is an important thing that needs to be done. We are using 
[express-session](https://www.npmjs.com/package/express-session) package to handle the session management. You can learn 
more about configuring the session feature in [Session part of HTTP Configuration](configuration.md#session) file. 

### Session Stores
There are multiple ways of storing session data on the server, to access them later on demand. Silvie supports `File` 
and `Redis` stores. 

The sessions will be stored by their identifiers which is a UUID, generated the first time you try to
write to the session. The UUID generator is [uuid](https://www.npmjs.com/package/uuid) package, which we are using the 
v4 method to generate session identifiers.

#### File Store
When you configure the session to use this kind of store, it will create a directory and emits a separate file for each 
session. The files will be deleted automatically after their expiration date passed.

#### Redis Store
Redis is a fast in-memory data store. Usually, people use it as database cache, message brokers or temporary data 
storage. Before you use the redis store as your session store, you need to make sure there is an accessible 
**Redis Server**. You can confirm this by the following command:

```bash
redis-cli ping
# PONG
```

If you see the `PONG` message, you are all good to go.

### Access Session Data
Reading and write to session is so straight forward. The express-session will create an object containing all your 
session key-value pairs. So if you want to set a value to your session, simply assign it to a property of that object 
and name it whatever you want, and later access it from just like reading a property from a regular object.

```typescript
import Controller, { route } from 'silvie/lib/http/controller';

class ViewCountController implements Controller {
    @route('GET', '/view')
    viewHandler(req, res) {
        if (req.session.views) {
            req.session.views += 1;
            
            res.send(`Your Views: ${req.session.views}`);
        } else {
            req.session.views = 1;
            
            res.send('First Visit');        
        }
    }
}
```

### Deleting Session Data
To delete a value from the session, just set it to `null` or use the `delete` operator.

```typescript
req.session.views = null;
delete req.session.views;
```

## File Uploads
Handling file uploads integrated into Silvie HTTP server with [multer](https://www.npmjs.com/package/uuid) package. 
Multer restricts file uploads to the structure you define for it, so the client won't be able to upload out of that 
structure.

Silvie created some wrapper functions as method decorators which can be imported from the base controller file located 
at `silvie/lib/http/controller`.

When you configure file uploads for HTTP server, you should specify a temp path. Multer will upload the acceptable files 
there, and then gives you a `File` object containing the path to that temporarily uploaded file and other file metadata.

### File Objects
Uploaded files will be accessible by `File` instances. A file instance contains the following information about the
uploaded file:  

- **fieldname**: The field name of the file
- **originalname**: The Original filename
- **encoding**: File encoding
- **mimetype**: File mime type
- **destination**: File path
- **filename**: File name
- **path**: Full file path
- **size**: File size in bytes

### Single File Upload
To let user upload a single with a specific field name, you need to use `singleUpload(fieldname)` method. This method takes a 
single parameter which is the field name to accept the file with. Then you can access the uploaded file with `req.file`.

```typescript
import Controller, { route, singleUpload } from 'silvie/lib/http/controller';

class UploadController implements Controller {
    @route('POST', '/single-upload')
    @singleUpload('profile')
    uploadUserProfile(req, res) {
        // Use req.file to do the upload
    }
}
```

### Multiple File Upload
This will let user upload multiple files with different field names. The method for this kind of file upload is 
`multipleUpload(...fields)`. This method will accept multiple parameters which each parameter is an object determining the `name` 
and `maxCount` for that field. If you don't specify a *maxCount*, it will use `1` as the default value. Then you can
access your files with `req.files` which indices of that object are the field names you provided before.

```typescript
import Controller, { route, multipleUpload } from 'silvie/lib/http/controller';

class UploadController implements Controller {
    @route('POST', '/multiple-upload')
    @multipleUpload({ name: 'facebook_profile' }, { name: 'post_thumbnails', maxCount: 10 })
    uploadFacebookPosts(req, res) {
        // Your files will be accessible from req.files

        // req.files.facebook_profile
        // req.files.post_thumbnails[0]
        // req.files.post_thumbnails[1]
        // ...
    }
}
```

### Array File Upload
Array file upload is useful when you have a multiple file select input in your application. This will allow user to 
upload more than one file with a single field name. Use `arrayUpload(fieldname, [maxCount])` method to achieve this. It 
accepts a `fieldname` and an optional `maxCount` parameter which defaults to `1` if not provided. Then it will give 
access to uploaded files from `req.files`.

```typescript
import Controller, { route, arrayUpload } from 'silvie/lib/http/controller';

class UploadController implements Controller {
    @route('POST', '/array-upload')
    @arrayUpload('images', 20)
    uploadImagesToGallery(req, res) {
        // Your files will be accessible from req.files

        // req.files[0]
        // req.files[1]
        // ...
    }
}
```

### Allow Upload
This method is to allow file uploads without any restrictions. You just need to use `allowUpload()` method to allow any
number of files with any field name to be uploaded to that route. Then you can access the uploaded files from 
`req.files`. The files object entries might not be defined if the client uploads to a field name that is not known for
the server.

```typescript
import Controller, { route, allowUploads } from 'silvie/lib/http/controller';

class UploadController implements Controller {
    @route('POST', '/uploads-anything')
    @allowUploads()
    uploadAnyFile(req, res) {
        // This route will accept any uploaded file

        // req.files.images -> Array
        // req.files.profile -> File
        // ...
    }
}
```

### Prevent Upload
If you want to prevent the client from uploading any files to a specific route, you should use `preventUpload()` method.
So if a request comes with a file attached to it, a `LIMIT_UNEXPECTED_FILE` error will be raised.

```typescript
import Controller, { route, preventUpload } from 'silvie/lib/http/controller';

class UploadController implements Controller {
    @route('POST', '/no-uploads')
    @preventUpload()
    weDontAcceptFiles(req, res) {
        // This route won't accept any file uploads
    }
}
```

## Request Bodies
You are able to configure different types of request bodies to be parsed and use them in your request handlers with 
`req.body`. The available body parsers are:

- **raw**: application/octet-stream
- **text**: text/plain
- **json**: application/json
- **urlencoded**: application/x-www-form-urlencoded

Each of these parsers will create a middleware on the Express application which only responds its associated mime type 
in the configuration file.
You can change their default mime type in [Body part of HTTP Configuration](configuration.md#body) file. Currently, 
there is a limitation in body parsers' configuration, and it will be improved in the future, so you the body parser 
configuration will be more flexible.

### Raw
Raw body parser will parse the request body into a `Buffer`. 

### Text
Text body parser will parse the request body as a plain text string. 

### JSON
JSON body parser will parse the request body into an equivalent of that JSON string. It can be configured to only parse
objects and arrays with `strict` option. Otherwise, it will parse anything that `JSON.parse` accepts as a valid JSON 
string.  

### URL Encoded
URL Encoded parser will parse the request body into an object, containing all key value pairs of your URL encoded 
string. This parser can also parse extended URL encoded strings with the `extended` option in the configuration file. 
Extended URL Encoded strings can contain nested data.

## Serve Static Assets
Silvie utilizes `Express.static` to serve static content. You need to tell Silvie about where the contents are and how
they need to be served. You should define your static content directories in the 
[Statics part of HTTP Configuration](configuration.md#statics) file, and their content will be served when the 
application starts.
