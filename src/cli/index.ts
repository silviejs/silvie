#!/usr/bin/env node

import 'src/bootstrap/process';
import log from 'src/utils/log';

// Check to see if it is running in the project root
if (process.rootPath !== process.cwd()) {
	log.error('[Silvie] Invalid Execution Path');
	log('Silvie CLI is only accessible from the project root');

	process.exit();
}

require('src/bootstrap/configs');
require('src/bootstrap/dotenv');
require('src/bootstrap/args');

// Import the main cli
require('./cli');
