import childProcess from 'child_process';
import log from 'base/utils/log';

export default (args: { port: string; p: string }) => {
	log.info('[Silvie Dev]', 'Starting a development server');

	const port = args.port || args.p;
	const cp = childProcess.exec(
		`cross-env BABEL_DISABLE_CACHE=1 NODE_ENV=development nodemon --exec babel-node --watch src src/bootstrap/index.ts -- -x ".ts,.js" ${
			port ? `--port ${port}` : ''
		}`,
		{ encoding: 'utf8' }
	);

	cp.stdout.on('data', (data) => {
		if (data.includes('[nodemon]')) {
			if (data.includes('[nodemon] app crashed')) {
				log.error('[Silvie Dev] App Crashed!', 'Waiting for changes...');
			}

			if (data.includes('[nodemon] restarting')) {
				log.warning('[Silvie Dev] Changes Detected!', 'Restarting...');
			}

			return;
		}

		log(data);
	});

	cp.stderr.on('data', (data) => {
		if (data.includes('EADDRINUSE')) {
			const portNumber = /port: (\d+)/.exec(data)[1];
			log.error('[Silvie Dev] Address in use');
			log(`Port '${portNumber || 'unknown'}' is already used. Please use a different port number.`);

			return;
		}

		log.error(data);
	});
};
