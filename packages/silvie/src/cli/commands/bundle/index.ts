import path from 'path';
import childProcess from 'child_process';
import log from 'src/utils/log';
import fs from 'fs';

export default () => {
	const rootDir = process.rootPath;
	const buildDir = path.resolve(rootDir, 'bundle');

	log.info('[Silvie Builder]', 'Checking Requirements...');

	let hasErrors = false;
	if (!fs.existsSync(path.resolve(rootDir, 'src/assets'))) {
		log.error('[Silvie Builder]', 'Assets directory not found');
		hasErrors = true;
	}
	if (!fs.existsSync(path.resolve(rootDir, '.env'))) {
		log.error('[Silvie Builder]', '.env file not found');
		hasErrors = true;
	}

	if (!hasErrors) {
		log.success('[Silvie Builder]', "Everything's good.");
	} else {
		return;
	}

	if (!fs.existsSync(buildDir)) {
		log.info('[Silvie Builder]', 'Creating bundle directory...');

		fs.mkdirSync(buildDir);
	} else {
		log.info('[Silvie Builder]', 'Cleaning bundle directory...');

		fs.readdirSync(buildDir).forEach((file) => {
			if (file !== '.silvie') {
				const filePath = path.resolve(buildDir, file);

				if (fs.lstatSync(filePath).isDirectory()) {
					fs.rmdirSync(filePath, { recursive: true });
				} else {
					fs.unlinkSync(filePath);
				}
			}
		});
	}

	log.info('[Silvie Bundler]', 'Bundling your application...');
	childProcess.execSync(
		`cross-env NODE_ENV=production IS_SILVIE_CLI=0 webpack --config ${path.resolve(
			process.silviePath,
			'assets/webpack.config.js'
		)}`,
		{ encoding: 'utf8' }
	);

	log.success('[Silvie Bundler]', 'Successfully finished bundling.');
};
