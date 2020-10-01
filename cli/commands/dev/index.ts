import childProcess from 'child_process';

export default () => {
	console.log('Starting a development server...');

	const cp = childProcess.exec(
		`cross-env BABEL_DISABLE_CACHE=1 NODE_ENV=development nodemon --exec babel-node --watch src src/bootstrap/index.ts -- -x ".ts,.js"`,
		{ encoding: 'utf8' }
	);

	cp.stdout.on('data', (data) => {
		if (data.includes('[nodemon]')) {
			if (data.includes('[nodemon] app crashed')) {
				console.log('App Crashed! Waiting for changes...');
			}

			if (data.includes('[nodemon] restarting')) {
				console.log('Changes Detected! Restarting...');
			}

			return;
		}

		console.log(data);
	});

	cp.stderr.on('data', (data) => {
		console.log('error', data);
	});
};
