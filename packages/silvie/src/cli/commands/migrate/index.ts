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

export default async (args: { _: string[]; rollback: boolean; refresh: boolean }) => {
	const filename = args._[1];

	const migrationsDir = path.resolve(process.rootPath, 'src/database/migrations');

	if (filename && fs.existsSync(path.resolve(migrationsDir, `${filename}.ts`))) {
		const migration = require(path.resolve(migrationsDir, `${filename}.ts`)).default;

		if (migration) {
			Database.init();

			await Database.disableForeignKeyChecks();

			if (args.rollback) {
				await migration.prototype.down();
			} else {
				if (args.refresh) {
					await migration.prototype.down();
				}

				await migration.prototype.up();
			}

			await Database.enableForeignKeyChecks();

			Database.closeConnection();
		} else {
			log.error('[Silvie] Migration Not Found');
			log(`There is no migration named '${filename}'`);
		}
	} else {
		const files = fs.readdirSync(migrationsDir);

		if (files.length > 0) {
			const migrations = files
				.map((file) => require(path.resolve(migrationsDir, file.replace(/\.ts$/, ''))).default)
				.sort((a, b) => (a.order || 0) - (b.order || 0));

			Database.init();

			await Database.disableForeignKeyChecks();

			if (args.rollback || args.refresh) {
				for (const migration of Object.values(migrations) as any[]) {
					await migration.prototype.down();
				}
			}

			if (!args.rollback) {
				for (const migration of Object.values(migrations) as any[]) {
					await migration.prototype.up();
				}
			}

			await Database.enableForeignKeyChecks();

			Database.closeConnection();
		} else {
			log.warning('[Silvie] No Migrations Found');
			log('You can create new migrations using', log.str`silvie make migration`.underscore().bright());
		}
	}
};
