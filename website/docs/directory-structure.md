---
id: directory-structure
title: Directory Structure
---
An initial and empty silvie project should have these files and folders in order to work properly. For a further 
explanation please take your time to get familiar with the structure and continue reading below.

```text
project root
├─ src
│  ├─ assets
│  ├─ bootstrap
│  │  ├─ index.ts
│  │  └─ types.d.ts
│  ├─ config
│  │  ├─ auth.ts
│  │  ├─ database.ts
│  │  ├─ graphql.ts
│  │  ├─ http.ts
│  │  ├─ mail.ts
│  │  └─ storage.ts
│  ├─ controllers
│  ├─ database
│  │  ├─ migrations
│  │  │  └─ index.ts
│  │  └─ seeders
│  │     └─ index.ts
│  ├─ graphql
│  │  ├─ dataloaders
│  │  ├─ resolvers
│  │  └─ schemas
│  └─ models
├─ .env
├─ .env.example
├─ .gitignore
└─ tsconfig.json
```
## Initial Directories
Now we are going to discuss each directory, and the reason it is important to for the Silvie. Some directories need you 
to create an initial file in them which is explained after directory description.

### Src
This is where you store your source codes. all of your static assets and code files must be located in this directory.

### Assets
This directory may contain your static assets. It will be copied to the output*(compiled)* directory after you build or
bundle your application. 

### Bootstrap
This directory will contain an index file which is meant to call the Silvie bootstrap function to start the 
application. You need to load all [schemas](#schemas), [resolvers](#resolvers) and [data loaders](#data-loaders) and pass 
them all to the bootstrap function, to initialize a GraphQL Server with those initial entities.

### Config
Your config files will be stored here. There must be some initial config files which you can learn more about in 
[Configuration Section](configuration.md)

### Controllers
This directory will contain the controllers.

### Migrations
This directory will contain database migrations which will create database entities from the schema definitions.

### Seeders
This directory will contain database seeders to insert initial data into database tables.

:::note Database Files
The migration files may contain foreign relations, so their order of execution matters.
Seeder files may also create some records that are necessary to create other records in other seeders, so their order
matter too.

To keep them in order. You need to have an index file in those directories and import/export the seeders in the correct
order of execution
:::

### Data
This directory will contain all of GraphQL data loaders.

### Resolvers
This directory will contain all of GraphQL resolvers.

### Schemas
This directory will contain all of GraphQL schemas.

:::note GraphQL Files
Please note that you need to import schemas, resolvers and data loaders in your bootstrap file and pass them to Silvie's
bootstrap function.  
:::

### Models
This directory will contain all of your models. They will be automatically loaded into the application.

## Initial Files
These files need to be created initially to run your application.

### .env
This file is a configuration file that may be different on various environments. It contains application specific 
information, database and redis credentials or any other environment variables you may want to inject into your codes. 

### .env.example <sup>optional</sup>
This file has no actual effect in the application. It is an empty template for the main `.env` file, because it is
not a good practice to upload `.env` files since it may contain sensitive passwords. You should make a copy of
`.env.example` on your server and fill in the blanks there.  

### .gitignore <sup>optional</sup>
If you are working with Git, you should exclude some directories. To prevent uploading them along with your codes.
- .env
- .silvie
- build
- bundle
- node_modules

### tsconfig.json
This is the typescript configuration file to resolve modules with an alias name and enable some language features.
You can learn more about Typescript configurations in Silvie, in [Configuration Section](configuration.md#tsconfig).


:::tip Helper Commands
To ensure the directory structure has been set up correctly, use `silvie check` command. Or if you need some help with 
creating the initial files or create missing files and directories, use `silvie fix` command. 
:::

---
##  Extra Directories
The following directories do not exist at first, But will be created next to src folder when you somehow run or build 
the application.

### .silvie
This directory is some sort of temporary directory which contains storage files, tmp upload directory and session files.
This is created automatically whenever you run the application in development mode. It will be created in production
too, but it will be in their corresponding directories.

### build
This directory will be created after you run the build command. The build command will compile your project files into
Node.js compatible files. Then you can run your application by running the `build/bootstrap/index.js` file.

### bundle
This directory will be created after you run the bundle command. This command will bundle all of your source files into
a single javascript file, then your will be able to run the application by running the `bundle/index.js` file.
