import Table from 'base/database/table';
import QueryBuilder from 'base/database/builders/query';
import { TBaseValue, TColumn } from 'base/database/builders/condition';

export default interface IDatabaseDriver {
	select(queryBuilder: QueryBuilder): Promise<any>;
	exists(queryBuilder: QueryBuilder): Promise<boolean>;

	count(queryBuilder: QueryBuilder): Promise<number>;
	average(queryBuilder: QueryBuilder, column: TColumn): Promise<number>;
	sum(queryBuilder: QueryBuilder, column: TColumn): Promise<number>;
	min(queryBuilder: QueryBuilder, column: TColumn): Promise<any>;
	max(queryBuilder: QueryBuilder, column: TColumn): Promise<any>;
	concat(queryBuilder: QueryBuilder, columns: TColumn[], separator?: string): Promise<string | string[]>;

	insert(queryBuilder: QueryBuilder): Promise<any>;

	update(queryBuilder: QueryBuilder): Promise<any>;
	bulkUpdate(queryBuilder: QueryBuilder): Promise<any>;

	delete(queryBuilder: QueryBuilder): Promise<any>;
	softDelete(queryBuilder: QueryBuilder): Promise<any>;
	undelete(queryBuilder: QueryBuilder): Promise<any>;

	createTable(table: Table): Promise<any>;
	truncateTable(tableName: string): Promise<any>;
	dropTableIfExists(tableName: string): Promise<any>;
	dropTable(tableName: string): Promise<any>;

	execute(query: string, params?: TBaseValue[]): Promise<any>;

	closeConnection(): void;
}
