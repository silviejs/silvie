/* eslint-disable */
const webpack = require('webpack');
const { parsed } = require('dotenv').config();

module.exports = () => {
	return new webpack.DefinePlugin(
		Object.keys(parsed).reduce((output, key) => {
			output[`process.env.${key}`] = parsed[key];
			return output;
		}, {})
	);
};
