import log from 'base/utils/log';

const options = {
	'-p --port': 'Specify a custom port number to run the server',
};

export default () => {
	log.warning('SILVIE CLI - Dev');
	log('This command will start a development server and transpiles your code on the fly.');
	log("You don't need to rerun your code after changes since it watches the src directory");

	log();
	log.info('Options:');
	Object.keys(options).forEach((option) => {
		log(' ', log.str`${option.padEnd(20, ' ')}`.bright(), '\t', options[option]);
	});

	log();
	log.info('Usage:');
	log('  silvie dev');
	log('  silvie dev --port 5000');
};
