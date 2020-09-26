import Table from 'base/database/table';

export default interface IDatabaseDriver {
	createTable(table: Table): Promise<any>;
	truncateTable(tableName: string): Promise<any>;
	dropTableIfExists(tableName: string): Promise<any>;
	dropTable(tableName: string): Promise<any>;

	execute(query: string, params?: string[]): Promise<any>;

	closeConnection(): void;
}
