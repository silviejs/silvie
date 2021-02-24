import 'src/bootstrap/paths';
import 'src/bootstrap/configs';
import 'src/bootstrap/dotenv';
import 'src/bootstrap/args';

import 'src/validator/rules';

import Database from 'src/database';
import Auth from 'src/authentication';
import Storage from 'src/storage';
import HTTPServer from 'src/http/server';
import GraphQLServer from 'src/graphql/server';

export default ({ schemas, resolvers, dataLoaders, beforeInit, beforeStart, afterStart }) => {
	if (beforeInit instanceof Function) {
		beforeInit();
	}

	Auth.init();
	Storage.init();

	if (process.configs?.database?.enabled) {
		Database.init();
	}

	HTTPServer.init();

	if (process.configs?.graphql?.enabled) {
		GraphQLServer.init(HTTPServer, schemas, resolvers, dataLoaders);
	}

	if (beforeStart instanceof Function) {
		beforeStart({ HTTPServer });
	}

	HTTPServer.start();

	if (afterStart instanceof Function) {
		afterStart({ HTTPServer });
	}
};
