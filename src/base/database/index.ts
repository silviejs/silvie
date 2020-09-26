import Table from 'base/database/table';
import IDatabaseDriver from 'base/database/driver';
import drivers from 'base/database/drivers';
import config from 'config/database';

export class Database {
	private static instance: Database;

	private driver: IDatabaseDriver;

	// eslint-disable-next-line no-empty-function,no-useless-constructor,@typescript-eslint/no-empty-function
	private constructor() {}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}

	init(): void {
		const type = config.type || process.env.DB_TYPE;

		if (type in drivers) {
			this.driver = new drivers[type]({
				host: config.host || process.env.DB_HOST,
				port: config.port || process.env.DB_PORT,

				database: config.database || process.env.DB_DATABASE,
				username: config.username || process.env.DB_USERNAME,
				password: config.password || process.env.DB_PASSWORD,

				...(config[type] ?? {}),
			});
		}
	}

	createTable(table: Table): Promise<any> {
		return this.driver.createTable(table);
	}

	truncateTable(tableName: string): Promise<any> {
		return this.driver.truncateTable(tableName);
	}

	dropTable(tableName: string): Promise<any> {
		return this.driver.dropTable(tableName);
	}

	dropTableIfExists(tableName: string): Promise<any> {
		return this.driver.dropTableIfExists(tableName);
	}

	closeConnection(): void {
		this.driver.closeConnection();
	}
}

export default Database.getInstance();
