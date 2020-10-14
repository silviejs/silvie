import log from 'silviePath/utils/log';

const options = {
	'-p --port': 'Specify a custom port number to run the server',
};

export default () => {
	log.warning('SILVIE CLI - Start');
	log('This command will start the application from the build directory.');
	log('This will not guarantee that the latest version will run.');
	log('You need to build the application yourself before starting it.');

	log();
	log.info('Options:');
	Object.keys(options).forEach((option) => {
		log(' ', log.str`${option.padEnd(20, ' ')}`.bright(), '\t', options[option]);
	});

	log();
	log.info('Usage:');
	log('  silvie start');
	log('  silvie start --port 5000');
};
