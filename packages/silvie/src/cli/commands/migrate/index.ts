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

export default async (args: { _: string[]; rollback: boolean; refresh: boolean; update: boolean }) => {
	const migrationsDir = path.resolve(process.rootPath, 'src/database/migrations');

	let filenames = args._.slice(1);

	if (filenames.length > 0) {
		filenames = filenames.filter((file) => {
			const exists = fs.existsSync(path.resolve(migrationsDir, `${file}.ts`));

			if (!exists) {
				log.error('[Silvie] Migration File Not Found');
				log(`There is no migration named '${file}'`);
			}

			return exists;
		});
	}

	if (filenames.length === 0) {
		filenames = fs.readdirSync(migrationsDir).map((file) => file.replace(/\.ts$/, ''));
	}

	if (filenames.length > 0) {
		const migrations = filenames
			.map((file) => {
				const migration = require(path.resolve(migrationsDir, file)).default;

				if (!migration) {
					log.error('[Silvie] Migration Not Found');
					log(`There is no migration in '${file}'`);
				}

				return migration;
			})
			.sort((a, b) => (a.order || 0) - (b.order || 0));

		Database.init();

		await Database.disableForeignKeyChecks();

		if (args.rollback || args.refresh) {
			for (const migration of migrations) {
				await migration.prototype.down();
			}
		}

		if (!args.rollback) {
			if (args.update) {
				for (const migration of migrations) {
					await migration.prototype.update();
				}
			} else {
				for (const migration of migrations) {
					await migration.prototype.up();
				}
			}
		}

		await Database.enableForeignKeyChecks();

		Database.closeConnection();
	} else {
		log.warning('[Silvie] No Migrations Found');
		log('You can create new migrations using', log.str`silvie make migration`.underscore().bright());
	}
};
