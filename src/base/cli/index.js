#!/usr/bin/env node
process.env.BABEL_DISABLE_CACHE = '1';

const path = require('path');

// Check to see if it is running in the project root
const rootPath = path.resolve(__dirname, '../../../');
const processPath = process.cwd();
if (rootPath !== processPath) {
	console.log('Silvie CLI is only accessible from the project root');
	process.exit();
}

process.rootPath = rootPath;
process.path = processPath;

// Using @babel/register to transpile the rest of the code
require('@babel/register')({
	extensions: ['.ts', '.js'],
});

// Import the main cli
require('./cli');
