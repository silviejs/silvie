---
id: cli
title: Silvie CLI
sidebar_label: CLI
---

Silvie comes with a CLI command which automates some handy routines for you. Silvie CLI only works from a project root.
A project root is a directory with a valid `package.json` file and `silvie package` installed as a project dependency.

Whenever silvie installs in a node project, npm will automatically create a symbolic link to the CLI, so it will be
accessible from your project directory.

## Build
Build command will take all of your source files and pipes them through babel to transpile them into Node.js
compatible equivalent files. The directory structure will be kept as is, and any other files that are not source files,
will be copied into the build folder.

The result will be a `build directory` in the project root, which contains compiled source files. Along with the source
files this command will also copy the `.env` file into the build directory.

Note that before starting to build the project, it will automatically clear the build directory.

```bash
silvie build
```

## Bundle
Bundle command will take building of your project to a next level. It uses webpack to process your project from its
entry point which is `src/bootstrap/index.ts` and compiles all source files through a babel loader, transpile GraphQL
files into their javascript notation and bundles all of them together into a minified and uglified file. It also injects
the variables of `.env` file into the output file.

The result will be a `bundle directory` which contains a single **index.js** file, and the assets directory which will
be copied during the bundling process.

```bash
silvie bundle
```

## Check
Check command will come to help whenever something is broken in the project. This command will check to see if a file or
directory is missing from the project files, and report with the missing directories and file names.

```bash
silvie check
```

## Dev
Dev command will run your application in the development mode. Which will watch the project source directory for changes
and rerun the application when something changes. This command will transpile your typescript files on the fly, so you
won't see an output directory when you run this command. It also has to be mentioned that when you run the project in
development mode, Silvie will create a `.silvie` directory in the projects root. You can read more about this, in the
[.silvie Directory](directory-structure.md#silvie) section.

#### --port, -p
You can specify a port number by passing this option.

```bash
silvie dev
# Run the application on the port in config files or the default port

silvie dev --port 8080
# Run the application on port 8080
```

## Fix
Fix command is a helper command to check your project structure. This command will create the missing base directories
and files, such as configuration files, bootstrap file, .env file or tsconfig.json file.

It wil also checks the required variables in `.env` file, adds the missing variables and fills the empty variables with
their default recommended value.

```bash
silvie fix
```

## Help
Help command will help you if you need more help with the CLI. If you need help with a specific command, you should just
pass the name of that command, and it will show you the help text for that command. Otherwise, it will show you the list
of all supported commands.

```bash
silvie help
# Shows the list of CLI commands

silvie help migrate
# Shows the migration command help text
```

## Make
This file becomes more handy when your project is growing, and you need to build a lot of files. The make command will
help you to create common files from their predefined templates. Here is the list of supported files, which can be made
using this command.

- **controller** - HTTP Controller
- **dataloader**<sup>[E]</sup> - GraphQL Data Loader 
- **middleware** - HTTP Middleware
- **migration**<sup>[E]</sup> - Database Migration
- **model**<sup>[E]</sup> - Model Entity
- **resolver**<sup>[E]</sup> - GraphQL Resolver
- **schema**<sup>[E]</sup> - GraphQL Schema
- **seeder**<sup>[E]</sup> - Database Seeder
- **test** - Unit Test File

You may notice that some of these items has an **[E]** tag. These kinds of files are entity files. Which will create an
entity in your project. When you are making one of these kinds, you can create others along with it, in a single command 
by passing these options to the make command:

#### --model, -M
Create a model for that entity.

#### --migration, -m
Create a migration for that entity.

#### --resolver, -r
Create a resolver for that entity.

#### --seeder, -S
Create a seeder for that entity.

#### --schema, -s
Create a schema for that entity.

#### --dataloader, -d
Create a data loader for that entity.

```bash
silvie make controller PostsController
# Creates a controller named 'PostsController'

silvie make model User -msr
# Creates a model named 'User' along with its migration, schema and resolver

silvie make resolver user -M --schema --dataloader
# Creates a user resolver along with its model, schema and data loader 
```


## Migrate
Migrate command will help you to build your database schemas one by one or all at once. If you specify a migration name,
it will use that specific migration file to do the job. Migration name is the filename of that migration without
extension. Otherwise, It will process all migration files. To learn more about migrations, read the
[Database Migration](migrations.md) section.

By default, this command will only tries to migrate*(create)* the schemas. You can change this behavior by specifying
one of these options:

#### --rollback
This will rollback*(delete)* the migrations.

#### --refresh
This option will first, rollback a migration and then tries to create it again.

```bash
silvie migrate
# This will migrate all of your schemas

silvie migrate users --refresh
# This will rollback and migrate the users migration
```

## Seed
Seed command will run your database seeders. You can specify the seeder name as you could in migrate command. You just
need to specify the seeder name for the command in order to run a single seeder. The seeder name is its filename without
extension. To learn more about seeders, read the [Database Seeder](seeders.md) section.

```bash
silvie seed
# This will run all database seeders

silvie seed users
# This will only run the users seeder
```

## Start
Start command will start the application from the build folder. If you run this command without having a successful
build of your application, You will see an error message, saying what the problem is with your build.

#### --port, -p
You can specify a port number by passing this option.

```bash
silvie dev
# Run the application on the port in config files or the default port

silvie dev --port 8080
# Run the application on port 8080
```

## Test
Test command will run all your test files and shows the results at the end. It is configured to search for any file
ending with `.test.ts` or `.test.js`. Location of test files can be anywhere in your project.

```bash
silvie test
```
