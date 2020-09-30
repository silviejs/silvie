import Database from 'base/database';
import Table from 'base/database/migration/table';

export default class Schema {
	static async create(tableName: string, tableCallback: (table: Table) => void): Promise<any> {
		try {
			const table = new Table(tableName);

			if (tableCallback instanceof Function) tableCallback(table);

			await Database.createTable(table);

			console.log(`${tableName} table created`);
		} catch ($ex) {
			console.log($ex);
		}
	}

	static async drop(tableName: string): Promise<any> {
		try {
			await Database.dropTable(tableName);

			console.log(`${tableName} table dropped`);
		} catch ($ex) {
			console.log($ex);
		}
	}

	static async dropIfExists(tableName: string): Promise<any> {
		try {
			await Database.dropTableIfExists(tableName);

			console.log(`${tableName} table dropped`);
		} catch ($ex) {
			console.log($ex);
		}
	}
}
