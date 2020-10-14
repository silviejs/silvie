import log from 'silviePath/utils/log';

export default () => {
	log.warning('SILVIE CLI - Bundle');
	log('This command will bundle the application into a single file in bundle directory.');
	log('You need to have a .env file and an assets directory to be copied there.');

	log();
	log.warning('Notice!', '.env file will directly loaded into code as hard-coded data.');

	log();
	log.info('Usage:');
	log('  silvie bundle');
};
