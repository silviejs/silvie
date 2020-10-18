#!/usr/bin/env node
/* eslint-disable no-console */

import path from 'path';
import fs from 'fs';

process.env.BABEL_DISABLE_CACHE = '1';

// Check to see if it is running in the project root
const rootPath = process.cwd() || path.resolve(__dirname, '../../../../');
const processPath = process.cwd();
if (rootPath !== processPath) {
	console.log('\x1b[31m\x1b[1m[Silvie] Invalid Execution Path\x1b[0m');
	console.log('Silvie CLI is only accessible from the project root');

	process.exit();
}

process.rootPath = rootPath;
process.silviePath = path.resolve(__dirname, '../../');

process.configs = {
	auth: {},
	database: {},
	graphql: {},
	http: {},
	storage: {},
};
const configPath = path.resolve(rootPath, 'src/config');
fs.readdirSync(configPath).forEach((file) => {
	// eslint-disable-next-line global-require,import/no-dynamic-require
	process.configs[file.split('.')[0]] = require(path.resolve(configPath, file));
});

// Import the main cli
require('./cli');
