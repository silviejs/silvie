import bootstrap from 'silvie/bootstrap';

import 'middlewares';
import 'controllers';

import * as schemas from 'graphql/schemas';
import * as resolvers from 'graphql/resolvers';
import * as dataLoaders from 'graphql/dataloaders';
import * as plugins from 'graphql/plugins';

import * as socketNamespaces from 'socket/namespaces';

bootstrap({
	graphql: {
		schemas,
		resolvers,
		dataLoaders,
		plugins,
	},
	socket: {
		socketNamespaces,
	},
});
