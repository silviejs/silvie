const path = require('path');

module.exports = (api) => {
	api.cache(true);

	const silviePath = __dirname;
	const rootPath = path.resolve(silviePath, '../../');

	return {
		presets: [['@babel/preset-env', { modules: 'cjs' }], '@babel/preset-typescript'],
		plugins: [
			[
				'@babel/plugin-transform-typescript',
				{
					allowDeclareFields: true,
				},
			],
			'@babel/plugin-proposal-optional-chaining',
			['@babel/plugin-proposal-decorators', { legacy: true }],
			'@babel/plugin-proposal-export-default-from',
			'@babel/plugin-proposal-nullish-coalescing-operator',
			'@babel/plugin-proposal-do-expressions',
			'@babel/plugin-proposal-class-properties',
			'@babel/plugin-transform-named-capturing-groups-regex',
			'@babel/plugin-proposal-optional-catch-binding',
			'@babel/plugin-transform-runtime',
			[
				'module-resolver',
				{
					extensions: [ '.ts', '.js', '.gql', '.graphql', '.json' ],
					root: [rootPath],
					alias: {
						silviePath: silviePath,
						src: path.resolve(rootPath, './src'),
						base: path.resolve(rootPath, './src/base'),
						bootstrap: path.resolve(rootPath, './src/bootstrap'),
						config: path.resolve(rootPath, './src/config'),
						controllers: path.resolve(rootPath, './src/controllers'),
						database: path.resolve(rootPath, './src/database'),
						graphql: path.resolve(rootPath, './src/graphql'),
						middlewares: path.resolve(rootPath, './src/middlewares'),
						models: path.resolve(rootPath, './src/models'),
					},
				},
			],
			[
				'wildcard-import',
				{ changeExtensions: { enabled: process.env.NODE_ENV === 'production', extensions: { ts: 'js' } } },
			],
			'import-graphql-files',
		],
	};
};
