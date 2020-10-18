import log from 'src/utils/log';

export default () => {
	log.warning('SILVIE CLI - Seed');
	log('This command will run one or all seeders to inject data into the database.');

	log();
	log.info('Usage:');
	log('  silvie seed');
	log('  silvie seed [seeder]');
};
