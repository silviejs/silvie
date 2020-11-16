import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { directories, files } from 'src/cli/helpers/project_structure';
import log from 'src/utils/log';

export default async () => {
	const root = process.rootPath;

	const badDirs = [];
	Object.keys(directories).forEach((dir) => {
		const dirPath = path.resolve(root, dir);

		if (!(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory())) {
			badDirs.push(dir);
		}
	});

	const badFiles = [];
	Object.keys(files).forEach((dir) => {
		const filePath = path.resolve(root, dir);

		if (!fs.existsSync(filePath)) {
			badFiles.push(dir);
		}
	});

	if (badDirs.length > 0) {
		log.error('Missing Directories:');
		badDirs.forEach((dir) => log(dir));
	}

	if (badFiles.length > 0) {
		if (badDirs.length > 0) {
			log('');
		}

		log.error('Missing Files:');
		badFiles.forEach((file) => log(file));
	}

	let envOK = true;
	if (!badFiles.includes('.env')) {
		const { parsed } = dotenv.config({ path: path.resolve(root, '.env') });

		if (!parsed.APP_KEY) {
			envOK = false;

			log.error('[Dotenv]', 'APP_KEY is not defined.');
		}

		if (!parsed.APP_PORT) {
			envOK = false;

			log.error('[Dotenv]', 'APP_PORT is not defined.');
		}

		if (!parsed.DB_TYPE) {
			envOK = false;

			log.error('[Dotenv]', 'DB_TYPE is not defined.');
		}

		if (!parsed.DB_HOST) {
			envOK = false;

			log.error('[Dotenv]', 'DB_HOST is not defined.');
		}

		if (!parsed.DB_PORT) {
			envOK = false;

			log.error('[Dotenv]', 'DB_PORT is not defined.');
		}

		if (!parsed.DB_DATABASE) {
			envOK = false;

			log.error('[Dotenv]', 'DB_DATABASE is not defined.');
		}

		if (!parsed.DB_USERNAME) {
			envOK = false;

			log.error('[Dotenv]', 'DB_USERNAME is not defined.');
		}
	}

	if (badDirs.length === 0 && badFiles.length === 0 && envOK) {
		log.success('Directory structure is valid');
	}
};
