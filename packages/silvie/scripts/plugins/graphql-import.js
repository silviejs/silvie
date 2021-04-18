const fs = require('fs/promises');
const gql = require('graphql-tag');

const graphqlImport = {
	name: 'graphql-import',

	setup(build) {
		build.onResolve({ filter: /\.(gql|graphql)$/ }, (args) => {
			return {
				path: args.path,
				namespace: 'graphql-loader',
				pluginData: {
					resolveDir: args.resolveDir,
				},
			};
		});

		build.onLoad({ filter: /.*/, namespace: 'graphql-loader' }, async (args) => {
			const fileContents = await fs.readFile(args.path);
			const gqlContents = gql`
				${fileContents}
			`;

			return { contents: `export default ${JSON.stringify(gqlContents)};`, resolveDir: args.pluginData.resolveDir };
		});
	},
};

module.exports = graphqlImport;
