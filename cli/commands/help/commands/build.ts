import log from 'silviePath/utils/log';

export default () => {
	log.warning('SILVIE CLI - Build');
	log('This command will build the application into the build directory.');
	log('You need to have a .env file and an assets directory to be copied there.');

	log();
	log.info('Usage:');
	log('  silvie build');
};
