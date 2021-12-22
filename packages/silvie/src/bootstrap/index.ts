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
import SocketServer from 'src/socket/server';

type TBootstrapOptions = {
	graphql?: {
		schemas: any;
		resolvers: any;
		dataLoaders: any;
		plugins: any;
	};
	socket?: {
		socketNamespaces: any;
	};
	events?: {
		beforeInit?: any;
		beforeStart?: any;
		afterStart?: any;
	};
};

export default async (options: TBootstrapOptions) => {
	if (options.events?.beforeInit instanceof Function) {
		options.events?.beforeInit();
	}

	Auth.init();
	Storage.init();

	if (process.configs?.database?.enabled) {
		Database.init();
	}

	HTTPServer.init();

	if (process.configs?.graphql?.enabled) {
		await GraphQLServer.init(
			HTTPServer,
			options.graphql?.schemas,
			options.graphql?.resolvers,
			options.graphql?.dataLoaders,
			options.graphql?.plugins
		);
	}

	if (process.configs?.socket?.enabled) {
		SocketServer.init(HTTPServer, options.socket?.socketNamespaces);
	}

	if (options.events?.beforeStart instanceof Function) {
		options.events?.beforeStart({ HTTPServer });
	}

	HTTPServer.start();

	if (options.events?.afterStart instanceof Function) {
		options.events?.afterStart({ HTTPServer });
	}
};
