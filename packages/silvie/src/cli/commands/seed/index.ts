/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require,no-await-in-loop,no-restricted-syntax */

import fs from 'fs';
import path from 'path';
import Database from 'src/database';
import log from 'src/utils/log';

import babelRegister from '@babel/register';

process.env.BABEL_DISABLE_CACHE = '1';
babelRegister({
	configFile: path.resolve(process.silviePath, 'assets/babel.config.js'),
	extensions: ['.ts', '.js', '.gql', '.graphql', '.json'],
	ignore: [],
});

export default async (args: { _: string[] }) => {
	const seedersDir = path.resolve(process.rootPath, 'src/database/seeders');

	let filenames = args._.slice(1);

	if (filenames.length > 0) {
		filenames = filenames.filter((file) => {
			const exists = fs.existsSync(path.resolve(seedersDir, `${file}.ts`));

			if (!exists) {
				log.error('[Silvie] Seeder File Not Found');
				log(`There is no seeder named '${file}'`);
			}

			return exists;
		});
	}

	if (filenames.length === 0) {
		filenames = fs.readdirSync(seedersDir).map((file) => file.replace(/\.ts$/, ''));
	}

	if (filenames.length > 0) {
		const seeders = filenames
			.map((file) => {
				const seeder = require(path.resolve(seedersDir, file)).default;

				if (!seeder) {
					log.error('[Silvie] Seeder Not Found');
					log(`There is no migration in '${file}'`);
				}

				seeder.filename = file;

				return seeder;
			})
			.sort((a, b) => (a.order || 0) - (b.order || 0));

		Database.init();

		await Database.disableForeignKeyChecks();

		for (const seeder of seeders) {
			try {
				await seeder.prototype.seed();

				log.success('Seeded', `Successfully seeded '${seeder.filename}'`);
			} catch (error) {
				log.error('Seed Failed', `Could not seed '${seeder.filename}'`);
				log(error);
			}
		}

		await Database.enableForeignKeyChecks();

		Database.closeConnection();
	} else {
		log.warning('[Silvie] No Seeders Found');
		log('You can create new seeders using', log.str`silvie make seeder`.underscore().bright());
	}
};
