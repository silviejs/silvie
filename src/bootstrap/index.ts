import * as dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';

import Database from 'base/database';

import HTTPServer from 'base/http/server';
import 'middlewares';
import 'controllers';

import GraphQLServer from 'base/graphql/server';
import * as schemas from 'graphql/schemas';
import * as resolvers from 'graphql/resolvers';
import * as dataLoaders from 'graphql/dataloaders';

import 'base/extensions';

import Example from 'models/example';

// Detect project root path
process.rootPath = path.resolve(__dirname, process.relativeRootPath || '../');

// Parse .env file
dotenv.config({
	path: path.resolve(process.rootPath, process.env.NODE_ENV === 'development' ? '../.env' : '.env'),
});

// Parse command line arguments
process.args = minimist(process.argv.slice(2));

Database.init();

HTTPServer.init();

GraphQLServer.init(HTTPServer, schemas, resolvers, dataLoaders);

HTTPServer.start();

Example.baseQueryBuilder
	.shuffle()
	.get()
	.then(async (res) => {
		console.log('res', res);
	});
