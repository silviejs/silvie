import 'base/extensions/process';

import * as dotenv from 'dotenv';
import minimist from 'minimist';
import HTTPServer from 'base/http/server';
import 'middlewares';
import 'controllers';

// Parse .env file
dotenv.config();

// Parse command line arguments
process.args = minimist(process.argv.slice(2));

HTTPServer.start(3000);
