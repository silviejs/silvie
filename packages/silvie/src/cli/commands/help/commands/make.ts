import log from 'src/utils/log';

const makers = {
	controller: 'HTTP Controller',
	middleware: 'HTTP Middleware',
	migration: 'Database Migration',
	seeder: 'Database Seeder',
	schema: 'GraphQL Schema',
	resolver: 'GraphQL Resolver',
	dataloader: 'GraphQL Data Loader',
	model: 'Model',
};

const options = {
	'-M --model': 'Make a model for the entity',
	'-S --seeder': 'Make a seeder for the entity',
	'-m --migration': 'Make a migration for the entity',
	'-r --resolver': 'Make a resolver for the entity',
	'-s --schema': 'Make a schema for the entity',
	'-d --dataloader': 'Make a data loader for the entity',
};

export default () => {
	log.warning('SILVIE CLI - Make');
	log('This command helps you create files like: models, middlewares, etc. from their predefined templates.');
	log('Entity make commands can be combined through the available options.');

	log();
	log.info('Makers:');
	Object.keys(makers).forEach((maker) => {
		log(' ', log.str`${maker.padEnd(20, ' ')}`.bright(), '\t', makers[maker]);
	});

	log();
	log.info('Options:');
	Object.keys(options).forEach((option) => {
		log(' ', log.str`${option.padEnd(20, ' ')}`.bright(), '\t', options[option]);
	});

	log();
	log.info('Usage:');
	log('  silvie make controller [name]');
	log('  silvie make model [name] -m');
};
