#!/usr/bin/env node

import fs from 'fs';
import ncp from 'ncp';
import childProcess from 'child_process';
import path from 'path';
import { createHash } from 'crypto';

const appName = process.argv[2];
if (!appName) {
	console.error('You should enter a name for your app');
	process.exit();
}

if (!new RegExp('^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$').test(appName)) {
	console.error('You should enter an npm valid name.');
	process.exit();
}

const appHash = createHash('sha256').update(`${appName}${Date.now()}${Math.random()}`).digest('hex');

const destPath = path.resolve(process.cwd(), appName);
if (fs.existsSync(destPath)) {
	if (fs.statSync(destPath).isDirectory()) {
		console.error(`Directory '${appName}' already exists in ${process.cwd()}`);
		process.exit();
	}
}

function generateEnvFile(rootPath: string): void {
	try {
		let contents = fs.readFileSync(path.resolve(rootPath, '.env.example'), 'utf-8');

		contents = contents
			.replace('APP_NAME=', `APP_NAME=${appName}`)
			.replace('APP_ENV=', 'APP_ENV=local')
			.replace('APP_PORT=', 'APP_PORT=3000')
			.replace('APP_DEBUG=', 'APP_DEBUG=true')
			.replace('APP_URL=', 'APP_URL=http://localhost:3000')
			.replace('APP_KEY=', `APP_KEY=${appHash}`)
			.replace('DB_TYPE=', `DB_TYPE=mysql`)
			.replace('DB_HOST=', 'DB_HOST=localhost')
			.replace('DB_PORT=', 'DB_PORT=3306')
			.replace('DB_USERNAME=', 'DB_USERNAME=root')
			.replace('DB_DATABASE=', `DB_DATABASE=test`);

		fs.writeFileSync(path.resolve(rootPath, '.env'), contents, 'utf-8');
	} catch (e) {
		console.error('Could not create .env file', e);
		process.exit();
	}
}

function generatePackageJsonFile(rootPath: string): void {
	try {
		let contents = fs.readFileSync(path.resolve(rootPath, 'package.json'), 'utf-8');

		contents = contents.replace('app-name', appName);

		fs.writeFileSync(path.resolve(rootPath, 'package.json'), contents, 'utf-8');
	} catch (e) {
		console.error('Could not create package.json file', e);
		process.exit();
	}
}

function verifyDirectoryStructure(rootPath: string): void {
	const directoriesToCreate = ['src/assets', 'src/database/seeders', 'src/graphql/dataloaders', 'src/middlewares'];

	const directoriesToCheck = [
		'src/bootstrap',
		'src/config',
		'src/controllers',
		'src/database/migrations',
		'src/database/seeders',
		'src/graphql/resolvers',
		'src/graphql/schemas',
		'src/models',
	];

	directoriesToCreate.forEach((directory) => {
		try {
			fs.mkdirSync(path.resolve(rootPath, directory), { recursive: true });
		} catch (e) {
			console.error(`Could not create create directory ${directory}`, e);
			process.exit();
		}
	});

	directoriesToCheck.forEach((directory) => {
		try {
			if (fs.existsSync(path.resolve(rootPath, directory))) {
				if (!fs.statSync(path.resolve(rootPath, directory)).isDirectory()) {
					console.error(`Path '${directory}' is not a directory`);
					process.exit();
				}
			} else {
				console.error(`Path '${directory}' does not exist`);
				process.exit();
			}
		} catch (e) {
			console.error(`An error occurred while checking directory structure`, e);
			process.exit();
		}
	});
}

function installSilvie(rootPath: string): void {
	try {
		childProcess.execSync(`npm i -S silvie --prefix ${rootPath}`, { stdio: [0, 1, 2] });
	} catch (e) {
		console.error('Could not install silvie package', e);
		process.exit();
	}
}

ncp(path.resolve(__dirname, 'templates/default'), destPath, (error) => {
	if (error) {
		console.error(`Could not copy boilerplate files`, error);
		process.exit();
	}

	try {
		fs.writeFileSync(
			path.resolve(destPath, '.gitignore'),
			`# Dependencies
node_modules

# Miscellaneous
/.silvie

# Build
/build
/bundle
`,
			'utf8'
		);
	} catch (renameError) {
		console.error(`Could not create .gitignore file`, renameError);
	}

	console.log('Copied the boilerplate files');

	console.log('Checking project structure...');
	verifyDirectoryStructure(destPath);
	console.log('Project structure is OK');

	generateEnvFile(destPath);
	console.log('Created .env file');

	generatePackageJsonFile(destPath);
	console.log('Created package.json file');

	console.log('Installing silvie...');
	installSilvie(destPath);
	console.log('Silvie has been installed');
});
