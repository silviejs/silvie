import ISeeder from 'base/database/migration/seeder';
import Example from 'models/example';

module.exports = class ExamplesTableSeeder implements ISeeder {
	async seed() {
		await Example.create(
			{
				name: 'Administrator',
			},
			false
		);
	}
};
