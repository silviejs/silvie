import * as dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';

import Database from 'base/database';
import Auth from 'base/authentication';
import Storage from 'base/storage';

import HTTPServer from 'base/http/server';
import 'middlewares';
import 'controllers';

import GraphQLServer from 'base/graphql/server';
import * as schemas from 'graphql/schemas';
import * as resolvers from 'graphql/resolvers';
import * as dataLoaders from 'graphql/dataloaders';

import 'base/validator/rules';

import 'base/extensions';
import Validator from 'base/validator';

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

const val = new Validator(
	{
		name: 'Hossein Maktoobian',
		age: 23,
		scores: {
			math: 20,
			lang: 19,
			chem: 19.5,
		},
		heights: [1, 5, 6, 7, 8],
		friends: [
			{
				name: 'Amin',
				family: 'Sharparesh',
				phone: '09124578963',
			},
			{
				name: 'Poorya',
				family: 'Jaafari',
				phone: '9366946405',
			},
		],
	},
	{
		name: 'required|name',
		age: 'required|numeric|min:1|max:150',
		'scores.*': 'required|numeric',
		heights: 'required|array|min:3',
		'heights.*': 'required|numeric',
		friends: 'required|array',
		'friends.*.name': 'required|name',
		'friends.*.family': 'required|name',
		'friends.*.phone': 'required|phone',
	}
);
