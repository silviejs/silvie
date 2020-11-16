import log from 'src/utils/log';

export default () => {
	log.warning('SILVIE CLI - Fix');
	log('This command will fix your directory structure. By doing the following:');
	log(' - Create missing directories');
	log(' - Create bootstrap file');
	log(' - Create missing configuration files');
	log(' - Set default values for the missing variables in .env file');

	log();
	log.info('Usage:');
	log('  silvie fix');
};
