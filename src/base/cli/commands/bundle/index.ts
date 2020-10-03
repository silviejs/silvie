import childProcess from 'child_process';

export default () => {
	console.log('Bundling your application...');
	childProcess.execSync(`cross-env NODE_ENV=production webpack --env.clean`, { encoding: 'utf8' });

	console.log('Bundle finished.');
};
