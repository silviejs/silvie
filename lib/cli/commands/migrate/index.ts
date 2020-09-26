import migrations from 'database/migrations';
import IMigration from 'base/database/migration';

export default async (args): Promise<any> => {
	const filename = args._[1];

	if (filename) {
		const migration = migrations[filename];

		if (args.rollback) {
			await migration.prototype.down();
		} else {
			if (args.refresh) await migration.prototype.down();

			await migration.prototype.up();
		}
	} else {
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
	}
};
