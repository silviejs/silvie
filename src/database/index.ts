import Table from 'database/migration/table';
import IDatabaseDriver from 'database/driver';
import drivers from 'base/driver/drivers';
import { TBaseValue } from 'database/builders/condition';
import config from '../../../../Desktop/silvie-test/src/config/database';

export class Database {
	/**
	 * [SINGLETON] The database instance
	 * @private
	 */
	private static instance: Database;

	/**
	 * The database driver instance
	 * @private
	 */
	private driver: IDatabaseDriver;

	/**
	 * [SINGLETON] Disable the constructor
	 * @private
	 */
	// eslint-disable-next-line no-empty-function,no-useless-constructor,@typescript-eslint/no-empty-function
	private constructor() {}

	/**
	 * [SINGLETON] Creates a new or returns the existing database instance
	 */
	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}

	/**
	 * Initializes a database driver based on the given config
	 */
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

	proxy(action: string, ...params): Promise<any> {
		return this.driver[action](...params);
	}

	raw(query: string, params?: TBaseValue[]): Promise<any> {
		return this.driver.execute(query, params);
	}

	/**
	 * Creates a table from the given table instance
	 * @param table
	 */
	createTable(table: Table): Promise<any> {
		return this.driver.createTable(table);
	}

	/**
	 * Empties a table
	 * @param tableName
	 */
	truncateTable(tableName: string): Promise<any> {
		return this.driver.truncateTable(tableName);
	}

	/**
	 * Drops a table without any further checks
	 * @param tableName
	 */
	dropTable(tableName: string): Promise<any> {
		return this.driver.dropTable(tableName);
	}

	/**
	 * Drops a table if it exists
	 * @param tableName
	 */
	dropTableIfExists(tableName: string): Promise<any> {
		return this.driver.dropTableIfExists(tableName);
	}

	/**
	 * Closes the current database connection
	 */
	closeConnection(): void {
		this.driver.closeConnection();
	}
}

export default Database.getInstance();
