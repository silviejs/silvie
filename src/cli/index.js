#!/usr/bin/env node
/* eslint-disable no-console */

process.env.BABEL_DISABLE_CACHE = '1';

const path = require('path');

// Check to see if it is running in the project root
const rootPath = path.resolve(__dirname, '../../../');
const processPath = process.cwd();
console.log(rootPath);
console.log(processPath);
if (rootPath !== processPath) {
	console.log('\x1b[31m\x1b[1m[Silvie] Invalid Execution Path\x1b[0m');
	console.log('Silvie CLI is only accessible from the project root');

	process.exit();
}

// Using @babel/register to transpile the rest of the code
require('@babel/register')({
	extensions: ['.ts', '.js'],
});

process.rootPath = rootPath;
process.path = processPath;

// Import the main cli
require('./cli');
