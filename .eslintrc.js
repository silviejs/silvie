module.exports = {
	env: {
		browser: true,
		es2020: true,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'no-plusplus': 'off',
	},
	settings: {
		'prettier/prettier': ['error'],

		'import/resolver': {
			alias: {
				map: [['src', './src']],
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.gql', '.json'],
			},
		},
	},
};
