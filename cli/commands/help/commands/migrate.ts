import log from 'silviePath/utils/log';

const options = {
	'--rollback': 'Rollback the target migrations',
	'--refresh': 'Refresh the target migrations',
};

export default () => {
	log.warning('SILVIE CLI - Migrate');
	log('This will run one or all migrations on the database.');
	log('You can choose to rollback or refresh the migration with options.');
	log('If no options are specified, It will only try to create the migrations.');

	log();
	log.info('Options:');
	Object.keys(options).forEach((option) => {
		log(' ', log.str`${option.padEnd(20, ' ')}`.bright(), '\t', options[option]);
	});

	log();
	log.info('Usage:');
	log('  silvie migrate');
	log('  silvie migrate [migration]');
};
