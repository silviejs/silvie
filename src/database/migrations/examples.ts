import IMigration from 'base/database/migration/migration';
import Schema from 'base/database/migration/schema';

module.exports = class ExamplesTableMigration implements IMigration {
	async up() {
		await Schema.create('examples', (table) => {
			table.id();
			table.string('name');
			table.timestamps();
		});
	}

	async down() {
		await Schema.dropIfExists('examples');
	}
};
