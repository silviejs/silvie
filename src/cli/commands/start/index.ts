import fs from 'fs';
import path from 'path';
import log from 'src/utils/log';
import childProcess from 'child_process';

export default (args: { port: string; p: string }) => {
	const buildPath = path.resolve(process.rootPath, 'build');
	if (!fs.existsSync(buildPath)) {
		log.error('[Silvie] Build Not Found');
		log('You should build the application first.');
		log('Use', log.str`silvie build`.underscore().bright(), 'command to build it.');
	}

	if (!fs.statSync(buildPath).isDirectory()) {
		log.error('[Silvie] Invalid Build');
		log('Build directory is not a directory');
	}

	if (!fs.existsSync(path.resolve(buildPath, '.env'))) {
		log.error('[Silvie] Env File Not Found');
		log('.env file is not present in the build directory.');
	}

	if (!fs.existsSync(path.resolve(buildPath, 'bootstrap/index.js'))) {
		log.error('[Silvie] Bootstrap Not Found');
		log('Unable to find bootstrap file.');
	}

	log.info('[Silvie]', 'Starting Application...');
	const port = args.port || args.p;
	const cp = childProcess.exec(
		`cross-env IS_SILVIE_CLI=0 node build/bootstrap/index.js${port ? ` --port ${port}` : ''}`,
		{ encoding: 'utf8' }
	);

	cp.stdout.on('data', (data) => {
		log(data);
	});

	cp.stderr.on('data', (data) => {
		if (data.includes('EADDRINUSE')) {
			const portNumber = /port: (\d+)/.exec(data)[1];
			log.error('[Silvie Dev] Address in use');
			log(`Port '${portNumber || 'unknown'}' is already used.`);
			log('Please use a different port number.');

			return;
		}

		log.error(data);
	});
};
