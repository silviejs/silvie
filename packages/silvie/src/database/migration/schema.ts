import Database from 'src/database';
import Table from 'src/database/migration/table';
import log from 'src/utils/log';

export default class Schema {
	static async create(tableName: string, tableCallback: (table: Table) => void, update = false): Promise<any> {
		try {
			const table = new Table(tableName);

			if (tableCallback instanceof Function) tableCallback(table);

			try {
				await Database.createTable(table);

				log.success('Created', tableName);
			} catch (error) {
				if (error.code === 'ER_TABLE_EXISTS_ERROR') {
					if (update) {
						try {
							await Database.updateTable(table);

							log.success('Updated', tableName);
						} catch (err) {
							log.error('Update Table Failed', err);
						}
					} else {
						log.warning('Already Created', tableName);
					}
				} else {
					log.error('Create Table Failed', error);
				}
			}
		} catch (ex) {
			log.error('Initialize Table Instance Failed', ex);
		}
	}

	static async drop(tableName: string): Promise<any> {
		try {
			await Database.dropTable(tableName);

			log.warning('Deleted', `${tableName} table`);
		} catch (ex) {
			log.error('Drop Table Failed', ex);
		}
	}

	static async dropIfExists(tableName: string): Promise<any> {
		try {
			await Database.dropTableIfExists(tableName);

			log.warning('Deleted', `${tableName} table`);
		} catch (ex) {
			log.error('Drop Table Failed', ex);
		}
	}
}
