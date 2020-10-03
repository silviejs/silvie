import seeders from 'database/seeders';
import Database from 'base/database';
import log from 'base/utils/log';

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
	} else if (Object.values(seeders).length > 0) {
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
