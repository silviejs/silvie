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
const migrations = require('proj/src/database/migrations/index').default;

export default async (args: { _: string[]; rollback: boolean; refresh: boolean }) => {
	const filename = args._[1];

	if (filename) {
		const migration = migrations[filename];

		if (migration) {
			Database.init();

			if (args.rollback) {
				await migration.prototype.down();
			} else {
				if (args.refresh) await migration.prototype.down();

				await migration.prototype.up();
			}

			Database.closeConnection();
		} else {
			log.error('[Silvie] Migration Not Found');
			log(`There is no migration named '${filename}'`);
		}
	} else if (Object.keys(migrations).length > 0) {
		Database.init();

		await Promise.all(
			Object.values(migrations)
				.map((migration: any) => {
					const output = [];

					if (args.rollback) {
						output.push(migration.prototype.down());
					} else if (args.refresh) {
						output.push(
							migration.prototype.down().then(() => {
								return migration.prototype.up();
							})
						);
					} else {
						output.push(migration.prototype.up());
					}

					return output;
				})
				.flat()
		);

		Database.closeConnection();
	} else {
		log.warning('[Silvie] No Migrations Found');
		log('You can create new migrations using', log.str`silvie make migration`.underscore().bright());
	}
};
