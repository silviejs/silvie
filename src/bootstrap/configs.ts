/* eslint-disable global-require,import/no-dynamic-require */

import path from 'path';
import fs from 'fs';

process.configs = {
	auth: {},
	database: {},
	graphql: {},
	http: {},
	storage: {},
};

const configPath = path.resolve(process.rootPath, 'src/config');

fs.readdirSync(configPath).forEach((file) => {
	process.configs[file.split('.')[0]] = require(path.resolve(configPath, file));
});
