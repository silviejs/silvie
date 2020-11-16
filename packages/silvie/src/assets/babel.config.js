module.exports = (api) => {
	api.cache(true);

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
					extensions: ['.ts', '.js', '.gql', '.graphql', '.json'],
					root: ['./'],
					alias: {
						src: './src',
						config: './src/config',
						controllers: './src/controllers',
						database: './src/database',
						graphql: './src/graphql',
						middlewares: './src/middlewares',
						models: './src/models',
					},
				},
			],
			[
				'wildcard-import',
				{
					changeExtensions: {
						enabled: process.env.NODE_ENV === 'production' && !process.env.IS_WEBPACK,
						extensions: { ts: 'js' },
					},
				},
			],
			'import-graphql-files',
		],
	};
};
