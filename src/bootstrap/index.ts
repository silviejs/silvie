import 'src/bootstrap/process';
import 'src/bootstrap/configs';
import 'src/bootstrap/dotenv';
import 'src/bootstrap/args';

import 'src/validator/rules';

import Database from 'src/database';
import Auth from 'src/authentication';
import Storage from 'src/storage';
import HTTPServer from 'src/http/server';
import GraphQLServer from 'src/graphql/server';

export default ({ schemas, resolvers, dataLoaders }) => {
	Auth.init();
	Storage.init();
	Database.init();
	HTTPServer.init();
	GraphQLServer.init(HTTPServer, schemas, resolvers, dataLoaders);
	HTTPServer.start();
};
