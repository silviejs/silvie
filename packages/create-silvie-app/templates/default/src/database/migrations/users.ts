import IMigration from 'silvie/database/migration/migration';
import Schema from 'silvie/database/migration/schema';

export default class UsersTableMigration implements IMigration {
	static order = 1;

	async up() {
		await Schema.create('users', (table) => {
			table.id();
			table.string('name');
			table.string('username').unique();
			table.string('email').unique();
			table.string('password');
			table.timestamps();
		});
	}

	async down() {
		await Schema.dropIfExists('users');
	}
}
