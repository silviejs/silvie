import path from 'path';
import childProcess from 'child_process';
import log from 'src/utils/log';

export default () => {
	log.info('[Silvie Bundler]', 'Bundling your application...');
	childProcess.execSync(
		`cross-env NODE_ENV=production IS_SILVIE_CLI=0 webpack --env.clean --config ${path.resolve(
			process.silviePath,
			'lib/assets/webpack.config.js'
		)}`,
		{ encoding: 'utf8' }
	);

	log.success('[Silvie Bundler]', 'Successfully finished bundling.');
};
