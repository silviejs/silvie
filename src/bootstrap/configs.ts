import path from 'path';
import fs from 'fs';

process.configs = process.autoLoadedConfigs || {};

//
// #if false
const configPath = path.resolve(
	process.rootPath,
	process.env.NODE_ENV === 'development' || process.env.IS_SILVIE_CLI === '1' ? 'src/config' : 'config'
);

fs.readdirSync(configPath).forEach((file) => {
	// eslint-disable-next-line global-require,import/no-dynamic-require
	process.configs[file.split('.')[0]] = require(path.resolve(configPath, file));
});
//
// #endif
