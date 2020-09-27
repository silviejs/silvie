import IMigration from 'base/database/migration';
import Schema from 'base/database/schema';

module.exports = class ExamplesTableMigration implements IMigration {
	async up() {
		await Schema.create('examples', (table) => {
			table.id();
			table.timestamps();
		});
	}

	async down() {
		await Schema.dropIfExists('examples');
	}
};
