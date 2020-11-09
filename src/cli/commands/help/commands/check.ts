import log from 'src/utils/log';

export default () => {
	log.warning('SILVIE CLI - Check');
	log('This command will check your projects directory structure and reports missing files and directories.');
	log('It also checks for required variables in the .env file.');

	log();
	log.info('Usage:');
	log('  silvie check');
};
