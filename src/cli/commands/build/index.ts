import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import log from 'src/utils/log';

export default async () => {
	const rootDir = process.rootPath;
	const buildDir = path.resolve(rootDir, 'build');

	log.info('[Silvie Builder]', 'Checking Requirements...');

	let hasErrors = false;
	if (!fs.existsSync(path.resolve(rootDir, 'src/assets'))) {
		log.error('[Silvie Builder]', 'Assets directory not found')
		hasErrors = true;
	}
	if (!fs.existsSync(path.resolve(rootDir, '.env'))) {
		log.error('[Silvie Builder]', '.env file not found')
		hasErrors = true;
	}

	if (!hasErrors) {
		log.success('[Silvie Builder]', "Everything's good.")
	} else {
		return;
	}

	if (!fs.existsSync(buildDir)) {
		log.info('[Silvie Builder]', 'Creating build directory...');

		fs.mkdirSync(buildDir);
	} else {
		log.info('[Silvie Builder]', 'Cleaning build directory...');

		fs.readdirSync(buildDir).forEach((file) => {
			const filePath = path.resolve(buildDir, file);

			if (fs.lstatSync(filePath).isDirectory()) {
				fs.rmdirSync(filePath, { recursive: true });
			} else {
				fs.unlinkSync(filePath);
			}
		});
	}

	log.info('[Silvie Builder]', 'Copying .env file...');
	fs.copyFileSync(path.resolve(rootDir, '.env'), path.resolve(buildDir, '.env'));

	log.info('[Silvie Builder]', 'Building your application...');
	childProcess.execSync(`cross-env NODE_ENV=production babel src -d build -x ".js,.ts" --copy-files --config-file ${path.resolve(process.silviePath, 'src/assets/babel.config.js')}`, { encoding: 'utf8' });

	log.success('[Silvie Builder]', 'Successfully finished building.');
};
