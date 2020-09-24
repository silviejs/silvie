import 'base/extensions';

import * as dotenv from 'dotenv';
import minimist from 'minimist';

import HTTPServer from 'base/http/server';
import 'middlewares';
import 'controllers';

import GraphQLServer from 'base/graphql/server';
import * as schemas from 'graphql/schemas';
import * as resolvers from 'graphql/resolvers';
import * as dataLoaders from 'graphql/dataloaders';

// Parse .env file
dotenv.config();

// Parse command line arguments
process.args = minimist(process.argv.slice(2));

GraphQLServer.init(HTTPServer, schemas, resolvers, dataLoaders);

HTTPServer.start(3000);
