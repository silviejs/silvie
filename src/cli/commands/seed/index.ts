import path from 'path';
import Database from 'src/database';
import log from 'src/utils/log';

import babelRegister from '@babel/register';

process.env.BABEL_DISABLE_CACHE = '1';
babelRegister({
	configFile: path.resolve(process.silviePath, 'babel.config.js'),
	extensions: ['.ts', '.js', '.gql', '.graphql', '.json'],
	ignore: [],
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const seeders = require('proj/src/database/seeders/index').default;

export default async (args: { _: string[]; rollback: boolean; refresh: boolean }) => {
	const filename = args._[1];

	if (filename) {
		const seeder = seeders[filename];

		if (seeder) {
			Database.init();

			await seeder.prototype
				.seed()
				.then(() => {
					log.success('Seeded', `Successfully seeded '${filename}'`);
				})
				.catch((err) => {
					log.error('Seed Failed', `Could not seed '${filename}'`);
					log(err);
				});

			Database.closeConnection();
		} else {
			log.error('[Silvie] Seeder Not Found');
			log(`There is no seeder named '${filename}'`);
		}
	} else if (Object.keys(seeders).length > 0) {
		Database.init();

		await Promise.all(
			Object.keys(seeders).map((key: string) => {
				return seeders[key].prototype
					.seed()
					.then(() => {
						log.success('Seeded', `Successfully seeded '${key}'`);
					})
					.catch((err) => {
						log.error('Seed Failed', `Could not seed '${key}'`);
						log(err);
					});
			})
		);

		Database.closeConnection();
	} else {
		log.warning('[Silvie] No Seeders Found');
		log('You can create new seeders using', log.str`silvie make seeder`.underscore().bright());
	}
};
