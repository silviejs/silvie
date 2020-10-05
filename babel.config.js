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
					root: ['./'],
					alias: {
						src: './src',
						base: './src/base',
						bootstrap: './src/bootstrap',
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
				'./lib/babel/plugins/wildcard-import',
				{ changeExtensions: { enabled: process.env.NODE_ENV === 'production', extensions: { ts: 'js' } } },
			],
			'import-graphql-files',
		],
	};
};
