import IMigration from 'base/database/migration';
import Schema from 'base/database/schema';

module.exports = class SamplesTableMigration implements IMigration {
	async up() {
		await Schema.create('samples', (table) => {
			table.id();
			table.string('name');
			table.timestamps();
		});
	}

	async down() {
		await Schema.dropIfExists('samples');
	}
};
