import fs from 'fs';
import path from 'path';
import { directories, files } from 'src/cli/helpers/project_structure';
import log from 'src/utils/log';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

export default async () => {
	const root = process.rootPath;

	let hasBadDirs = false;
	Object.keys(directories).forEach((dir) => {
		const dirPath = path.resolve(root, dir);

		if (!fs.existsSync(dirPath)) {
			hasBadDirs = true;
			fs.mkdirSync(dirPath, { recursive: true });
			log.info('[Directory Created]', dir);
		}
	});

	if (hasBadDirs) {
		log('');
	}

	let envEmitted = false;
	let hasBadFiles = false;
	Object.keys(files).forEach((file) => {
		const filePath = path.resolve(root, file);

		if (!fs.existsSync(filePath)) {
			hasBadFiles = true;
			if (files[file] === 'dotenv') {
				const appName = path.basename(root);
				const appHash = createHash('sha256').update(`${appName}${Date.now()}${Math.random()}`).digest('hex');

				const content = fs
					.readFileSync(path.resolve(__dirname, `./samples/dotenv.txt`), 'utf8')
					.replace(/APP_NAME=/, `APP_NAME=${/\s/gi.test(appName) ? `"${appName}"` : appName}`)
					.replace(/APP_KEY=/, `APP_KEY=${appHash}`);

				fs.writeFileSync(filePath, content, 'utf8');

				envEmitted = true;
			} else {
				fs.copyFileSync(path.resolve(__dirname, `./samples/${files[file]}.txt`), filePath);
			}

			log.info('[File Created]', file);
		}
	});

	const typesFilePath = path.resolve(root, 'src/bootstrap/types.d.ts');
	if (!fs.existsSync(typesFilePath)) {
		fs.copyFileSync(path.resolve(__dirname, `./samples/types.d.txt`), typesFilePath);

		log.info('[File Created]', 'src/bootstrap/types.d.ts');
	}

	let envOK = true;
	if (!envEmitted) {
		const appName = path.basename(root);
		const appHash = createHash('sha256').update(`${appName}${Date.now()}${Math.random()}`).digest('hex');
		const envPath = path.resolve(root, '.env');

		let content = fs.readFileSync(envPath, 'utf8');
		const { parsed } = dotenv.config({ path: envPath });

		if (!parsed.APP_KEY) {
			envOK = false;

			if (parsed.APP_KEY === '') {
				content = content.replace(/APP_KEY=/, `APP_KEY=${appHash}`);
			} else {
				content += `\nAPP_KEY=${appHash}`;
			}
		}

		if (!parsed.APP_PORT) {
			envOK = false;

			if (parsed.APP_PORT === '') {
				content = content.replace(/APP_PORT=/, `APP_PORT=3000`);
			} else {
				content += `\nAPP_PORT=3000`;
			}
		}

		if (!parsed.DB_TYPE) {
			envOK = false;

			if (parsed.DB_TYPE === '') {
				content = content.replace(/DB_TYPE=/, `DB_TYPE=mysql`);
			} else {
				content += `\nDB_TYPE=mysql`;
			}
		}

		if (!parsed.DB_HOST) {
			envOK = false;

			if (parsed.DB_HOST === '') {
				content = content.replace(/DB_HOST=/, `DB_HOST=localhost`);
			} else {
				content += `\nDB_HOST=localhost`;
			}
		}

		if (!parsed.DB_PORT) {
			envOK = false;

			if (parsed.DB_PORT === '') {
				content = content.replace(/DB_PORT=/, `DB_PORT=3306`);
			} else {
				content += `\nDB_PORT=3306`;
			}
		}

		if (!parsed.DB_DATABASE) {
			envOK = false;

			if (parsed.DB_DATABASE === '') {
				content = content.replace(/DB_DATABASE=/, `DB_DATABASE=test`);
			} else {
				content += `\nDB_DATABASE=test`;
			}
		}

		if (!parsed.DB_USERNAME) {
			envOK = false;

			if (parsed.DB_USERNAME === '') {
				content = content.replace(/DB_USERNAME=/, `DB_USERNAME=root`);
			} else {
				content += `\nDB_USERNAME=root`;
			}
		}

		if (!envOK) {
			fs.writeFileSync(envPath, content, 'utf8');
			log.info('[Dotenv]', '.env file has been fixed');
		}
	}

	if (!(hasBadDirs || hasBadFiles) && envOK) {
		log.success('[ALL GOOD]', 'There is nothing to be fixed.');
	}
};
