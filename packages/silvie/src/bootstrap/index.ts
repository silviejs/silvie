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
import {instanceCallback} from "src/utils/mail";

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
	instanceCallbacks?: {
		mail?: any;
		database?: any;
		http?: any;
		graphql?: any;
		socket?: any;
	};
};

export default async (options: TBootstrapOptions) => {
	if (options.events?.beforeInit instanceof Function) {
		options.events?.beforeInit();
	}

	Auth.init();
	Storage.init();

	instanceCallback.callback = options.instanceCallbacks?.mail;

	if (process.configs?.database?.enabled) {
		Database.init(options.instanceCallbacks?.database);
	}

	HTTPServer.init(options.instanceCallbacks?.http);

	if (process.configs?.graphql?.enabled) {
		await GraphQLServer.init(
			HTTPServer,
			options.graphql?.schemas,
			options.graphql?.resolvers,
			options.graphql?.dataLoaders,
			options.graphql?.plugins,
			options.instanceCallbacks?.graphql
		);
	}

	if (process.configs?.socket?.enabled) {
		SocketServer.init(HTTPServer, options.socket?.socketNamespaces, options.instanceCallbacks?.socket);
	}

	if (options.events?.beforeStart instanceof Function) {
		options.events?.beforeStart({ HTTPServer });
	}

	HTTPServer.start();

	if (options.events?.afterStart instanceof Function) {
		options.events?.afterStart({ HTTPServer });
	}
};
