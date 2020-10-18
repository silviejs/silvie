module.exports = {
	env: {
		browser: true,
		es2020: true,
		jest: true,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'no-param-reassign': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'no-plusplus': 'off',
		'class-methods-use-this': 'off',
	},
	settings: {
		'prettier/prettier': ['error'],

		'import/resolver': {
			alias: {
				map: [
					['src', './src'],
					['base', './src/base'],
					['bootstrap', './src/bootstrap'],
					['controllers', './src/controllers'],
					['database', './src/database'],
					['graphql', './src/graphql'],
					['middlewares', './src/middlewares'],
					['models', './src/models'],
				],
				extensions: ['.js', '.ts', '.gql', '.json'],
			},
		},
	},

	overrides: [
		{
			files: ['**/*.ts'],

			extends: ['plugin:@typescript-eslint/recommended', 'airbnb-base', 'plugin:prettier/recommended'],
			parser: '@typescript-eslint/parser',

			plugins: ['@typescript-eslint', 'prettier'],
			rules: {
				'no-param-reassign': 'off',
				'import/no-unresolved': 'off',
				'import/extensions': 'off',
				'no-plusplus': 'off',
				'class-methods-use-this': 'off',
				'@typescript-eslint/no-namespace': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
			},
		},
	],
};
