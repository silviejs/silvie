const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('./lib/webpack/plugins/dotenv');

const isProduction = process.env.NODE_ENV !== 'development';

module.exports = (env) => {
	const config = {
		entry: './src/bootstrap/index.ts',
		output: {
			path: path.resolve(__dirname, 'bundle'),
			filename: 'index.js',
		},

		mode: isProduction ? 'production' : 'development',

		target: 'node',
		node: {
			__dirname: false,
			__filename: false,
		},
		externals: [nodeExternals()],

		resolve: {
			extensions: ['.ts', '.js', '.gql', '.json'],
		},

		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							plugins: [['./lib/babel/plugins/wildcard-import', {}]],
						},
					},
				},
				{
					test: /\.(graphql|gql)$/,
					exclude: /node_modules/,
					use: {
						loader: 'graphql-tag/loader',
					},
				},
			],
		},

		plugins: [Dotenv(), new CopyWebpackPlugin({ patterns: [{ from: './assets', to: './assets' }] })],

		optimization: {},
	};

	if (isProduction) {
		config.optimization.minimizer = [
			new TerserPlugin({
				cache: true,
				sourceMap: false,
				parallel: true,
				terserOptions: {
					output: {
						comments: false,
					},
				},
			}),
		];
	}

	if (env.clean) {
		config.plugins.push(new CleanWebpackPlugin());
	}

	return config;
};
