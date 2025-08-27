import { ApolloServer } from 'apollo-server-express';
import { merge } from 'lodash';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlUploadExpress } from 'graphql-upload';
import { middlewares } from 'src/http/middleware';
import BaseQuery from 'src/graphql/base/schemas/query.gql';
import BaseMutation from 'src/graphql/base/schemas/mutation.gql';
import UploadSchema from 'src/graphql/base/schemas/upload.gql';
import UploadResolver from 'src/graphql/base/resolvers/upload';
import JSONSchema from 'src/graphql/base/schemas/json.gql';
import JSONResolver from 'src/graphql/base/resolvers/json';
import flattenImports from 'src/utils/import/flatten';
import mapImports from 'src/utils/import/map';

const config = process.configs.graphql;

function makeSchema(schemas, resolvers) {
	const typeDefsCollection = [BaseQuery, BaseMutation];
	const resolversCollection = [];

	if (config.allowUpload) {
		typeDefsCollection.push(UploadSchema);
		resolversCollection.push(UploadResolver);
	}

	if (config.allowJSON) {
		typeDefsCollection.push(JSONSchema);
		resolversCollection.push(JSONResolver);
	}

	typeDefsCollection.push(...schemas);
	resolversCollection.push(...resolvers);

	return makeExecutableSchema({
		typeDefs: typeDefsCollection as any,
		resolvers: merge(...resolversCollection),
	});
}

class GraphQLServer {
	srv: any;

	async init(httpServer, schemas, resolvers = {}, dataLoaders = {}, plugins = {}, instanceCallback?: any) {
		const executableSchema = makeSchema(flattenImports(schemas), flattenImports(resolvers));

		let graphqlServer = new ApolloServer({
			schema: executableSchema,

			introspection: config.introspection,
			nodeEnv: config.nodeEnv,

			plugins: flattenImports(plugins),

			context: async (context) => {
				const contextLoaders = mapImports(dataLoaders, (dataLoader) => dataLoader(context));

				return {
					res: context.res,
					req: context.req,
					loaders: contextLoaders,
					timestamp: Date.now(),
				};
			},
		});

		if (instanceCallback instanceof Function) {
			graphqlServer = instanceCallback(graphqlServer)
		}

		this.srv = graphqlServer;

		const path = config.path ?? '/graphql';

		if (config.middleware && middlewares[config.middleware])
			httpServer.expressServer.use(path, middlewares[config.middleware]);

		if (config.allowUpload) {
			httpServer.expressServer.use(
				graphqlUploadExpress({
					maxFiles: config.maxFiles,
					maxFileSize: config.maxFileSize,
				})
			);
		}

		await graphqlServer.start();

		graphqlServer.applyMiddleware({
			app: httpServer.expressServer,
			path,
			bodyParserConfig: false,
			cors: false,
		});
	}
}

const server = new GraphQLServer();

export default server;
