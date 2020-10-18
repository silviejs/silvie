const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvProvider = require('webpack-dotenv-provider');

const isProduction = process.env.NODE_ENV !== 'development';

module.exports = (env) => {
	process.env.IS_WEBPACK = true;

	const config = {
		entry: './src/bootstrap/index.ts',
		output: {
			path: path.resolve(process.cwd(), 'bundle'),
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
							configFile: path.resolve(__dirname, 'babel.config.js'),
							plugins: [['wildcard-import', {}]],
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

		plugins: [
			DotenvProvider(),
			new webpack.DefinePlugin({ 'process.relativeRootPath': "'./'" }),
			new CopyWebpackPlugin({
				patterns: [{ from: 'src/assets', to: './assets' }],
			}),
		],

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
