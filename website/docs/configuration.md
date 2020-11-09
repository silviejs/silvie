---
id: configuration
title: Configuration
---

There are a few configuration files which define how the application should work. They should be in the `src/config` 
path. Here you will see configuration files in details. Each configuration file should return an object literal with 
their configurations. Note that the configuration file exports must be in `Common JS` format.

## Authentication
Silvie comes with a built-in authentication helper that we are going to discuss more in 
[Authentication Section](authentication.md). The file must be stored in `src/config/auth.ts`.

#### driver
This option specifies the driver to manage the authentication process. For now, it only supports `JWT` as the 
authentication driver.

### JWT Options
#### secret
JWT driver needs a secret to encrypt a given payload and generate a token for it. If you don't specify a secret, it will
take `APP_KEY` from the .env file as it's default value;

#### blacklist
An invalid **JWT Token** must be expired or blacklisted. One of the methods to blacklist a token is to store it into a
blacklist file. So you need to specify a relative file path to create and use this file. The relative path will be 
resolved into the `.silvie` directory.

A sample authentication configuration file:

```typescript
module.exports = {
	driver: 'jwt',

	jwt: {
		secret: '6Zfj3bE8c3BGfKhhCAQOCgQQC0goEvdDR8x4lbQhFMJT2JcUe2gsPDzk149c', 
		blacklist: './tmp/blacklist'
	}
};
```

---

## Database
Silvie has a [Database](database.md) helper class to work with various databases through the predefined drivers. The file must be 
stored in `src/config/database.ts`. 

#### type
This options will define the database type. Currently, `mysql` is the only option you have, but we plan to add more 
databases in the future. This will take `DB_TYPE` variable in .env file as its default value.
 
#### host
This will define the database host. It can be an IP, localhost or a remote address. This will take `DB_HOST` variable in .env file as its default value.

#### port
The database port will be here. Each database has its port depends on the configuration. For example MySQL runs on 
`3306` port by default. This will take `DB_PORT` variable in .env file as its default value.

#### database
The database name that you need to use in the application. This will take `DB_DATABASE` variable in .env file as its default value.

#### username
The username of the database user. This will take `DB_USERNAME` variable in .env file as its default value.

#### password
The password of the database user. Leave empty if user has no password. This will take `DB_PASSWORD` variable in
.env file as its default value. 

### MySQL Options
#### connectionLimit
The maximum number of connections that can be made into the database,

#### dateStrings
Weather to convert dates into strings or not.

#### multipleStatements
Weather to allow running multiple statements in a single query or not. 

A sample database configuration file:

```typescript
module.exports = {
	type: 'mysql',
	host: 'localhost',
	port: '3306',

	database: 'test_db',
	username: 'root',
	password: '',

	mysql: {
		connectionLimit: 10,
		dateStrings: true,
		multipleStatements: true
	}
};
```

---

## GraphQL
Silvie has a built in [GraphQL Server](graphql.md). Which can be configured through this configuration file. The file must be stored 
in `src/config/graphql.ts`.

#### enabled
This option specifies weather to initialize and run a GraphQL server or not.

#### path
This option specifies the GraphQL endpoint which will accept the incoming request.

#### middleware
You can specify an HTTP middleware for the GraphQL endpoint to process the incoming request before passing it to the 
GraphQL server. Leave blank for none. 

#### playground
Specifies weather to enable the GraphQL Playground or not.

#### introspection
Specifies the state of GraphQL introspection system.

#### allowJSON
Specifies Weather to enable `JSON` and `JSONObject` data types or not.

#### allowUpload
Specifies Weather to allow file uploads in GraphQL or not. It also creates an `Upload` data type. 

#### maxFiles
Specifies the Maximum number of files that can be uploaded into GraphQL server.

#### maxFileSize
Specifies the maximum size of an uploaded file in bytes. 

A sample GraphQL configuration file:

```typescript
module.exports = {
	enabled: true,

	path: '/graphql',
	middleware: '',

	playground: true,
	introspection: true,

	allowJSON: true,

	allowUpload: true,
	maxFiles: 10,
	maxFileSize: 10485760
};
```
---

## HTTP
The main part of Silvie is an [HTTP Server](http.md). The HTTP server uses [Express Server](https://expressjs.com) as
the underlying web server. The configuration file for HTTP server will be stored in `src/config/http.ts`. This 
configuration file has more complex structure than the others.

#### HTTP2
Specifies weather to use HTTP/2 instead of HTTP/1.1.

#### port
Defines the port which application will use it to run the HTTP server.

#### trustProxy
This option must be enabled when the app is running behind a reverse proxy server or not. This will cause the server to 
tell express to allow incoming `X-Forwarded-*` headers.

### Statics
Sometimes you need to serve static files through your HTTP server. This option will take an **array** of static path
configurations. A static path configuration may have the following options:

#### path
The actual path of the directory in the file system. If it is a relative path. It will be resolved from the execution
path.

#### alias
The alias option will define a custom url to serve the contents of the given directory. If it is not specified, it will
take the directory name as the url.

#### options
This option will define the behavior on this static path.

##### acceptRanges
Weather to accept range request or not. It is handy if you are serving media files.

##### cacheControl
Enable or disable setting the `Cache-Control` header on the response.

##### dotfiles
Defines the behavior of the server when a user is trying to request for a dotfile. Possible values are: 
- **"allow"**: Responds with the actual file
- **"deny"**: Responds with a `403 Forbidden` 
- **"ignore"**: Responds with a `404 Not Found` even if the file exists

##### etag
This option will be set on the `ETag` header. Possible values are:
- **true**: This will enable weak ETag
- **false**: This will disable
- **"weak"**: This will enable weak ETag
- **"strong"**: This will enable strong ETag

##### extensions
This option specifies an array of extension fallbacks. If the actual file was not found, server will search for the files with
extensions in the array and responds with the first matching file.

##### immutable
This option will prevent the client to check if the file has change or not until the maxAge option expires. If you set 
this option to `true`, you also need to specify the `maxAge`.

##### index
Weather to send the index file or not when a user is trying to access a directory.

##### lastModified
Weather to send the files last modified date as the `Last-Modified` header or not.

##### maxAge
Set `max-age` of `Cache-Control` header for the files that are being served from this path in milliseconds.

##### redirect
Weather to redirect to trailing '/' or not when the pathname is a directory.

```typescript
module.exports = {
    // ...
	statics: [
		{
			path: './assets',
			alias: null,
			options: {
				acceptRanges: true,
				cacheControl: true,
				dotfiles: 'ignore',
				etag: true,
				extensions: false,
				immutable: false,
				index: false,
				lastModified: true,
				maxAge: 0,
				redirect: true,
			}
		}
	]
    // ...
}
```

### Body
This part will define how the server should parse the incoming request bodies. Currently, these data types are being 
supported:
- **text**: plain/text
- **raw**: application/octet-stream
- **json**: application/json
- **urlencoded**: application/x-www-form-urlencoded

Note that you can use their behavior on other mime types. You just need to change the type parameter of that data type.

#### enabled
This option will enable/disable the body parser all along.


#### General Body Options
The following options are allowed on all data types.

##### enabled
Weather to enable or disable that data type.

##### inflate
If set to `true` the deflated<sup>(compressed)</sup> bodies will be inflated, but if set to `false`, the deflated bodies
will be ignored.

##### limit
Specifies the maximum size of incoming data in bytes.

##### type
Specifies the corresponding mime type of the incoming data.

#### Text Specific Options
These options can only be defined on the text data type.

##### defaultCharset
Specifies the default charset of the text when tries to decode the incoming raw data.

#### JSON Specific Options
These options can only be defined on the JSON data type.

##### strict
If set to `true`, it only accepts `Object`s and `Array`s. If set to `false`, accepts any valid JSON syntax.

#### URL Encoded Specific Options
These options can only be defined on the URL Encoded data type.

##### extended
If set to `true`, It will allow parsing of nested and deep urlencoded data by using the **qs** library for parsing. If 
set to `false`, It will only parse some simple urlencoded requests by using the **querystring** library.

##### parameterLimit
Specifies the maximum number of parameters in the incoming request body.


```typescript
module.exports = {
    // ...
	body: {
        enabled: true,

        text: {
            enabled: false,
            inflate: true,
            limit: '10mb',
            type: 'text/plain',
            defaultCharset: 'utf-8',
        },
        raw: {
            enabled: false,
            inflate: true,
            limit: '10mb',
            type: 'application/octet-stream',
        },
        json: {
            enabled: true,
            inflate: true,
            strict: true,
            limit: '10mb',
            type: 'application/json',
        },
        urlencoded: {
            enabled: true,
            inflate: true,
            extended: true,
            limit: '10mb',
            parameterLimit: 1000,
            type: 'application/x-www-form-urlencoded',
        },
    }
    // ...
}
```

### Cookies
If you need to handle cookies in your request you need to enable it with this option.

#### enabled
This option will enable/disable the cookies in the HTTP requests.

#### secret
This option will be used to encrypt cookies to generate secure cookies. It will take `APP_KEY` as its default value if 
it is not provided.

```typescript
module.exports = {
    // ...
	cookie: {
		enabled: true,
		secret: ''
	}
    // ...
}
```

### Session
If you need to handle client sessions in your server, you need to configure this part. Session identifiers will be 
stored in cookies. So you need to configure session cookie options too.

#### enabled
This will enable/disable session feature in the HTTP server.

#### secret
The secret will be used to encrypt session data to improve their security.

#### reSave
Forces the session to save it again into the store event it was not change during the request.

#### saveUninitialized
Forces the session to save into the store when it is new and not modified. 

#### unset
When a session was set to null or deleted, this option specifies to keep the session in the store or not. Possible 
values for this option are:
- **"keep"**: Keeps the session but modifications will be ignored
- **"destroy"**: Deletes the session from the store when the response ends

#### trustProxy
This has to be true if the server is sitting behind a reverse proxy. You need to set this when you are using secure 
cookies with your session.

#### driver
This option specifies the session store driver. This can be `redis` or `file`.

#### Driver Options
Driver options will specify the options for each type of session store driver.  

#### File Driver Options
The file driver only takes these three options:

##### path
Specifies the path to save the session files there.

##### extension
Specifies the extension of the session files. 

##### ttl
Specifies the maximum valid age of a session.

#### Redis Driver Options
Redis driver is a recommended choice since Redis is a memory base key-value store if you are not having memory limits on 
your machine. 

##### host
The Redis host will be specified here. It will take `REDIS_HOST` as its default value if you leave it blank. 

##### port
The Redis port on your machine. Usually it has to be `6379` but depends on the redis server configuration. It will take 
`REDIS_PORT` as its default value if you leave it blank.

##### password
Specifies the password to connect to the redis server. If your Redis server does not have any password, you can leave
this field blank, and yes, it will take `REDIS_PASS` as its default value, so you need to make sure that `REDIS_PASS` is 
also blank in `.env` file. 

##### ttl
Specifies the maximum valid age of a session record.

##### prefix
The key prefix used to store the session data. This is useful when there are multiple applications working with the same 
redis server instance, and you don't want them to overwrite each other records. 

#### Cookie Options
These options specify how the session cookie has to be sent to the client and how it will be stored.

##### name
The name of the session identified cookie

##### path
The path of the cookie.

##### httpOnly
Specify weather the cookie is HTTP Only or not.

##### maxAge
Specify the maximum age of the session identified cookie to live. 

##### sameSite
Specify weather the cookie must be store with a `same-site` attribute or not.

##### secure
Specify weather the cookie should only be transferred through SSL connections or not.


```typescript
module.exports = {
    // ...
	session: {
        enabled: true,
        secret: '',
        reSave: false,
        saveUninitialized: false,
        unset: 'destroy',
        trustProxy: true,

        driver: 'file',
        driverOptions: {
            file: {
                path: './session',
                extension: '.json',
                ttl: 86400
            },
            redis: {
                host: '',
                port: '',
                password: '',
                ttl: 86400,
                prefix: 'sess:'
            },
        },

        cookie: {
            name: 'sid',
            path: '/',
            httpOnly: true,
            maxAge: 86400000,
            sameSite: true,
            secure: true
        }
    }
    // ...
}
```

### Uploads
As every HTTP server needs to handle file uploads, you have the option here to enable file uploads in the server. 

#### enabled
This option will enable/disable the upload feature in the HTTP server.

#### tempDirectory
Specifies a temporary path to upload the incoming files and then process the uploaded files from there.

#### maxFileSize
Specifies the maximum uploaded file size in bytes 

```typescript
module.exports = {
    // ...
	uploads: {
		enabled: true,
		tempDirectory: './tmp',
		maxFileSize: 10485760
	}
    // ...
}
```

### SSL
Silvie supports using SSL Certificates to secure the connection on the HTTP server. This is how you can configure HTTPS.

#### enabled
This option specifies weather to enable SSL on the HTTP server or not.  

#### certFile
The filename of the certificate cert file.

#### keyFile
The filename of the certificate key file.

#### passphrase
This option will be required if your certificates needs a passphrase to work.

```typescript
module.exports = {
    // ...
	ssl: {
		enabled: false,
		certFile: '',
		keyFile: '',
		passphrase: ''
	}
    // ...
}
```

### CORS
This part will let you specify your configuration for `Cross Origin Resource Sharing` aka `CORS`. This can limit the 
requests coming from out of your API domain. It is an object with the following properties.

#### enabled
This will enable/disable the CORS on the HTTP server.

#### originsAllowed
This option will define an array of origins that are allowed to make requests to your server. If you want to allow all 
origins, just write `*` as the first item of this array.

#### methodsAllowed
This option will define an array of allowed HTTP verbs for the incoming requests. 

#### headersAllowed
This option will define an array of allowed HTTP headers that are being sent with an incoming request. Pass `null` to
allow all headers.

#### headersExposed
This option specifies an array of allowed HTTP headers that can be sent with the response

#### allowCredentials
This option specifies if it is okay to expose the response credentials to the front-end javascript code or not. The 
credentials might be cookies, authorization headers or TLS certificates.

#### optionsSuccessStatus
This option defines the HTTP status code of the `OPTIONS Request`. It is usually either **200** or **204**. 

#### maxAge
This option indicates how long can the result of a preflight request can be cached in the browser.

#### continuePreflight
Specifies weather to pass the preflight request to the next handler or just respond from the CORS handler.

```typescript
module.exports = {
    // ...
    cors: {
        enabled: true,
        originsAllowed: ['*'],
        methodsAllowed: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        headersAllowed: null,
        headersExposed: null,
        allowCredentials: true,
        optionsSuccessStatus: 200,
        maxAge: null,
        continuePreflight: false
    }
}
```

---

## Mail
The mail helper will connect to an SMTP server and will send emails from your server. Here you will have to enter the 
server credentials and define email accounts to be used later for sending emails. The mail helper will be discussed more
later in the [Mail Section](mail.md). The file must be stored in `src/config/mail.ts`.

#### enabled
This option will enable or disable the mail functionality.

#### host
This will specify the hostname of the target mail server.

#### port
This will specify the port number of your mail server. Default port of standard SMTP might be `25`, `465` or `578`.

#### secure
Determines if the connection should be made over TLS or not.

#### rejectUnauthorized
This option will determine weather to reject unauthorized SSL certificates or not.

#### accounts
This is the option that you will define your email accounts. It is an object that keys will be the email addresses, and 
their corresponding value has to be an object containing a `username` and a `password` to access that email account.

Here is a sample mail configuration file.

```typescript
export default {
	enabled: false,

	host: 'example.com',
	port: '465',

	secure: true,
	rejectUnauthorized: false,

	accounts: {
		'test@example.com': {
			username: 'test@example.com',
			password: '',
		}
	}
};
```

---

## Storage
Silvie has a storage helper class, which handles file system operations. It is useful when you are uploading files or 
need to manage your files on the server. The configuration file must be stored in `src/config/storage.ts`.

#### path
The path to initialize storage disks. The relative path will be resolved from the execution path.

#### disks
This is an object which defines the storage disks. The keys will be the storage name, and their value will be the actual 
directory name for that disk. For further explanation on disks, go to [Storage Disks](storage.md#disk) section.

#### files
The storage helper is able to create files. This is the configuration for the file creator.

##### Filename Hash Configuration
The files that are generated without specifying a name, will get a hashed name. Here you need to specify a hashing 
`algorithm` that defaults to **sha256** and a `salt` method which defaults to **APP_KEY** if left empty.

A sample storage configuration file:

```typescript title="src/config/storage.ts"
module.exports = {
	path: './storage',

	disks: {
		default: 'default'
	},

	files: {
		hash: {
			algorithm: 'sha256',
			salt: ''
		}
	}
};
```

---

## Dotenv
.env files are one of the best ways to keep your environment specific variables organized somewhere. A .env file must be 
created in the root of the project. It will be copied into the build folder or injected into the bundled code.

### Application
These variables will be in different parts of the application itself.

#### APP_NAME
This will create a name for the application. You may want to show it somewhere in the future.

#### APP_ENV
This defines the environment in which the application is running. 

#### APP_PORT
This has to be a port number to run the application with that port. If no port was pass through the CLI args, this port 
will be used with a higher priority than the port in the [HTTP Port Config](#port-1)

#### APP_DEBUG
Determines weather the application is in debug mode or not.

#### APP_URL
Specifies the URL of the application. This may be useful when you want to make requests to this URL, or show it somewhere 
in your responses.

#### APP_KEY
This one is the most important variable here. Specifies a unique key for the application to use it in encryption and 
salting hash data.

### Database
These variables will be used to connect to a database when the application starts.

#### DB_TYPE
Specifies the database type. For now, silvie just supports `mysql`.

#### DB_HOST
Specifies the database server hostname. Usually it is `localhost`, an IP address, or a full hostname. 

#### DB_PORT
Specifies the database server port number. The default port number for MySQL is `3306`.

#### DB_USERNAME
Specifies the database user username.

#### DB_PASSWORD
Specifies the database user password. Leave it blank if there was no password set for the user

#### DB_DATABASE
Specifies the database name.

### Redis 
The redis credentials will be used in the redis session driver. 

#### REDIS_HOST
Specifies the hostname of your redis server. This can be `localhost`, an IP address, or a full hostname.

#### REDIS_PORT
Specifies the redis server port number which is `6379` on a standard redis installation.

#### REDIS_PASSWORD
If your server needs a password for connecting to it, you should write it down here. Otherwise, leave it blank if there 
is no password.

Here is the content for a `.env.example` file:

```dotenv
APP_NAME=
APP_ENV=
APP_PORT=
APP_DEBUG=
APP_URL=
APP_KEY=

DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

:::tip
Don't forget to fill in the `APP_*` and `DB_*` fields in .env file. They are necessary to run the app!
:::

---

## Typescript
Since Silvie is working with the typescript, you need to create a configuration file for it in the root of the project.
The file must be named `tsconfig.json`. To learn more about typescript configuration files, 
[read here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). 

You may have noticed that there is a part here named `paths`. In this part, we create alias paths for out main 
directories to prevent writing dirty relative paths everywhere we need to import a module.

Here is the recommended content for this file.

```json title="tsconfig.json"
{
	"compilerOptions": {
		"module": "commonjs",
		"esModuleInterop": true,
		"target": "es5",
		"moduleResolution": "node",
		"sourceMap": true,
		"outDir": "build",
		"experimentalDecorators": true,
		"baseUrl": ".",
		"downlevelIteration": true,
		"paths": {
			"src/*": ["./src/*"],
			"config/*": ["./src/config/*"],
			"controllers/*": ["./src/controllers/*"],
			"database/*": ["./src/database/*"],
			"graphql/*": ["./src/graphql/*"],
			"middlewares/*": ["./src/middlewares/*"],
			"models/*": ["./src/models/*"]
		}
	}
}
```

---

If you don't have the **config directory** in your project, `silvie fix` command will create the missing files with their default
values.
