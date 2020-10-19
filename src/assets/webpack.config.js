const fs = require('fs');
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

	const rootDir = process.cwd();

	const config = {
		entry: './src/bootstrap/index.ts',
		output: {
			path: path.resolve(rootDir, 'bundle'),
			filename: 'index.js',
		},

		mode: isProduction ? 'production' : 'development',

		target: 'node',
		node: {
			__dirname: false,
			__filename: false,
		},
		externals: [
			nodeExternals({
				allowlist: [/^silvie/],
			}),
		],

		resolve: {
			extensions: ['.ts', '.js', '.gql', '.json'],
		},

		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								configFile: path.resolve(__dirname, 'babel.config.js'),
								plugins: [['wildcard-import', {}]],
							},
						},
						'webpack-conditional-loader',
					],
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
			DotenvProvider({ path: path.resolve(rootDir, '.env') }),
			new webpack.DefinePlugin({ 'process.relativeRootPath': JSON.stringify('./') }),
			new webpack.DefinePlugin({
				'process.autoLoadedConfigs': `{${fs
					.readdirSync(path.resolve(rootDir, 'src/config'))
					.map((filename) => {
						// eslint-disable-next-line global-require,import/no-dynamic-require
						const content = require(`${path.resolve(rootDir, `src/config/${filename}`)}`);
						return `${filename.split('.')[0]}: ${JSON.stringify(content)}`;
					})
					.join(',')}}`,
			}),
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
