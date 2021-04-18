import 'src/bootstrap/paths';
import 'src/bootstrap/configs';
import 'src/bootstrap/dotenv';
import 'src/bootstrap/args';

import 'src/validator/rules/*';

import Database from 'src/database';
import Auth from 'src/authentication';
import Storage from 'src/storage';
import HTTPServer from 'src/http/server';
import GraphQLServer from 'src/graphql/server';
import SocketServer from 'src/socket/server';

type TBootstrapOptions = {
	schemas: any;
	resolvers: any;
	dataLoaders: any;
	socketNamespaces: any;
	beforeInit?: any;
	beforeStart?: any;
	afterStart?: any;
};

export default (options: TBootstrapOptions) => {
	if (options.beforeInit instanceof Function) {
		options.beforeInit();
	}

	Auth.init();
	Storage.init();

	if (process.configs?.database?.enabled) {
		Database.init();
	}

	HTTPServer.init();

	if (process.configs?.graphql?.enabled) {
		GraphQLServer.init(HTTPServer, options.schemas, options.resolvers, options.dataLoaders);
	}

	if (process.configs?.socket?.enabled) {
		SocketServer.init(HTTPServer, options.socketNamespaces);
	}

	if (options.beforeStart instanceof Function) {
		options.beforeStart({ HTTPServer });
	}

	HTTPServer.start();

	if (options.afterStart instanceof Function) {
		options.afterStart({ HTTPServer });
	}
};
