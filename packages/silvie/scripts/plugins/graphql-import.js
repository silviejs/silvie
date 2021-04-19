const fs = require('fs/promises');
const gql = require('graphql-tag');

module.exports = (options = { extensions: ['gql', 'graphql'] }) => {
	const regExp = `.(${options.extensions.map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`;
	const filterRegExp = new RegExp(regExp);

	return {
		name: 'graphql-import',

		setup(build) {
			build.onResolve({ filter: filterRegExp }, (args) => {
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
};
