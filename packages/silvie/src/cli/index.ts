#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import './path_flags';
import 'src/bootstrap/paths';
import log from 'src/utils/log';

// Check to see if it is running in the project root
if (process.rootPath !== process.cwd() || !fs.existsSync(path.resolve(process.rootPath, 'node_modules/silvie'))) {
	log.error('[Silvie] Invalid Execution Path');
	log('Silvie CLI is only accessible from the project root');
	log('Project root is where silvie package is found under node_modules');

	process.exit();
}

require('src/bootstrap/args');
require('src/bootstrap/dotenv');
require('src/bootstrap/configs');

// Import the main cli
require('./cli');
