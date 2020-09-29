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
import QueryBuilder from 'base/database/builders/query';

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

new QueryBuilder('examples')
	.bulkUpdate(
		[
			{
				id: 1,
				name: 'Ardeshir Shirzadian',
			},
			{
				id: 3,
				name: 'Hossein Maktoobian',
			},
			{
				id: 5,
				name: 'Mina Lachinani',
			},
		],
		['id']
	)
	.then((result) => console.log(result));
