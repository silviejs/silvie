module.exports = (api) => {
	api.cache(false);

	return {
		presets: [['@babel/preset-env', { modules: 'cjs' }], '@babel/preset-typescript'],
		plugins: [
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
						graphql: './src/graphql',
						middlewares: './src/middlewares',
					},
				},
			],
			[
				'./lib/babel/plugins/wildcard-import',
				{ changeExtensions: { enabled: process.env.NODE_ENV === 'production', extensions: { ts: 'js' } } },
			],
			'./lib/babel/plugins/graphql-import',
		],
	};
};
