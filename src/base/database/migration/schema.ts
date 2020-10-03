import Database from 'base/database';
import Table from 'base/database/migration/table';
import log from 'base/utils/log';

export default class Schema {
	static async create(tableName: string, tableCallback: (table: Table) => void): Promise<any> {
		try {
			const table = new Table(tableName);

			if (tableCallback instanceof Function) tableCallback(table);

			await Database.createTable(table);

			log.success('Created', tableName);
		} catch (ex) {
			if (ex.code === 'ER_TABLE_EXISTS_ERROR') {
				log.error('Schema Exists', tableName);
			} else {
				log(ex);
			}
		}
	}

	static async drop(tableName: string): Promise<any> {
		try {
			await Database.dropTable(tableName);

			log.warning('Deleted', `${tableName} table`);
		} catch (ex) {
			log(ex);
		}
	}

	static async dropIfExists(tableName: string): Promise<any> {
		try {
			await Database.dropTableIfExists(tableName);

			log.warning('Deleted', `${tableName} table`);
		} catch (ex) {
			log(ex);
		}
	}
}
