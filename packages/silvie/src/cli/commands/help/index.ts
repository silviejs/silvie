import log from 'src/utils/log';
import * as commands from 'src/cli/commands/help/commands/*';

const mainCommands = {
	build: 'Build the application',
	bundle: 'Bundle application into a single file',
	dev: 'Start a development server',
	help: 'Show this help page',
	make: 'Make initial file from template',
	migrate: 'Migrate the schemas to the database',
	seed: 'Seed initial data to the database',
	start: 'Start the application from build directory',
	test: 'Run all tests',
};

export default (args: { _: string[] }) => {
	const commandName = args._[1];

	if (commandName) {
		if (commandName in commands) {
			commands[commandName]();
		} else {
			log.error('Invalid Help', `There is no further help for '${commandName}' command`);
		}
	} else {
		log.warning('SILVIE CLI Helper');

		log();
		log.info('Commands:');
		Object.keys(mainCommands).forEach((command) => {
			log(' ', log.str`${command.padEnd(20, ' ')}`.bright(), '\t', mainCommands[command]);
		});

		log();
		log.info('Usage:');
		log('  silvie make controller ExampleController');
		log('  silvie build');
		log('  silvie migrate examples');

		log();
		log.info('Extra Help:');
		log('  silvie help [command]');
	}
};
