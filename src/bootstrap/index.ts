import * as dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';
import Database from 'src/database';
import Auth from 'src/authentication';
import Storage from 'src/storage';
import HTTPServer from 'src/http/server';
import 'middlewares';
import 'controllers';
import GraphQLServer from 'src/graphql/server';
import * as schemas from 'graphql/schemas';
import * as resolvers from 'graphql/resolvers';
import * as dataLoaders from 'graphql/dataloaders';
import 'src/validatorator/rules';
import 'src/extensionsions';

// Detect project root path
process.rootPath = path.resolve(__dirname, process.relativeRootPath || '../');

// Parse .env file
dotenv.config({
	path: path.resolve(process.rootPath, process.env.NODE_ENV === 'development' ? '../.env' : '.env'),
});

// Parse command line arguments
process.args = minimist(process.argv.slice(2));

Auth.init();

Storage.init();

Database.init();

HTTPServer.init();

GraphQLServer.init(HTTPServer, schemas, resolvers, dataLoaders);

HTTPServer.start();
