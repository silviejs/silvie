import { ApolloServer } from 'apollo-server-express';
import { merge } from 'lodash';
import { makeExecutableSchema, ITypeDefinitions, ITypedef } from 'graphql-tools';
import { graphqlUploadExpress } from 'graphql-upload';
import { middlewares } from 'silviePath/http/middleware';
import BaseQuery from 'graphql/base/schemas/query.gql';
import BaseMutation from 'graphql/base/schemas/mutation.gql';
import UploadSchema from 'graphql/base/schemas/upload.gql';
import UploadResolver from 'graphql/base/resolvers/upload';
import JSONSchema from 'graphql/base/schemas/json.gql';
import JSONResolver from 'graphql/base/resolvers/json';
import config from 'config/graphql';

function makeSchema(schemas, resolvers) {
	const typeDefsCollection: ITypeDefinitions = [BaseQuery as ITypedef, BaseMutation as ITypedef];
	const resolversCollection = [];

	if (config.allowUpload) {
		typeDefsCollection.push(UploadSchema as ITypedef);
		resolversCollection.push(UploadResolver);
	}

	if (config.allowJSON) {
		typeDefsCollection.push(JSONSchema as ITypedef);
		resolversCollection.push(JSONResolver);
	}

	typeDefsCollection.push(...schemas);
	resolversCollection.push(...resolvers);

	return makeExecutableSchema({
		typeDefs: typeDefsCollection,
		resolvers: merge(...resolversCollection),
	});
}

class GraphQLServer {
	init(httpServer, schemas, resolvers, dataLoaders) {
		const executableSchema = makeSchema(Object.values(schemas), Object.values(resolvers));

		const graphqlServer = new ApolloServer({
			schema: executableSchema,

			introspection: config.introspection,
			playground: config.playground,
			uploads: false,

			context: async (context) => {
				const contextLoaders = Object.keys(dataLoaders).reduce((group, key) => {
					group[key] = dataLoaders[key](context);
					return group;
				}, {});

				return {
					req: context.req,
					loaders: contextLoaders,
					timestamp: Date.now(),
				};
			},
		});

		const path = config.path ?? '/graphql';

		if (config.middleware && middlewares[config.middleware])
			httpServer.server.use(path, middlewares[config.middleware]);

		if (config.allowUpload) {
			httpServer.server.use(
				graphqlUploadExpress({
					maxFiles: config.maxFiles,
					maxFileSize: config.maxFileSize,
				})
			);
		}

		graphqlServer.applyMiddleware({
			app: httpServer.server,
			path,
			bodyParserConfig: false,
		});
	}
}

const server = new GraphQLServer();

export default server;
