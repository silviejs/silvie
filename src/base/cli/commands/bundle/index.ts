import childProcess from 'child_process';
import log from 'base/utils/log';

export default () => {
	log.info('[Silvie Bundler]', 'Bundling your application...');
	childProcess.execSync(`cross-env NODE_ENV=production webpack --env.clean`, { encoding: 'utf8' });

	log.success('[Silvie Bundler]', 'Successfully finished bundling.');
};
