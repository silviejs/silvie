import fs from 'fs';
import path from 'path';
import { ncp } from 'ncp';
import childProcess from 'child_process';

export default async () => {
	const rootDir = process.rootPath;
	const buildDir = path.resolve(rootDir, 'build');

	if (!fs.existsSync(buildDir)) {
		console.log('Creating build directory...');

		fs.mkdirSync(buildDir);
	} else {
		console.log('Cleaning build directory...');

		fs.readdirSync(buildDir).forEach((file) => {
			const filePath = path.resolve(buildDir, file);

			if (fs.lstatSync(filePath).isDirectory()) {
				fs.rmdirSync(filePath, { recursive: true });
			} else {
				fs.unlinkSync(filePath);
			}
		});
	}

	console.log('Copying assets directory...');
	await new Promise<any>((resolve, reject) => {
		ncp(path.resolve(rootDir, 'src/assets'), path.resolve(buildDir, 'assets'), (error) => {
			if (error) {
				reject(error);
			}

			resolve();
		});
	});

	console.log('Copying .env file...');
	fs.copyFileSync(path.resolve(rootDir, '.env'), path.resolve(buildDir, '.env'));

	console.log('Building your application...');
	childProcess.execSync(`cross-env NODE_ENV=production babel src -d build -x ".js,.ts"`, { encoding: 'utf8' });

	console.log('Build finished.');
};
