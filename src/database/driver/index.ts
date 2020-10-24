import Table from 'src/database/migration/table';
import QueryBuilder from 'src/database/builders/query';
import { TBaseValue, TColumn } from 'src/database/builders/condition';

export type IModificationResult = [number, number];
export type IInsertionResult = [any, number];

export default interface IDatabaseDriver {
	select(queryBuilder: QueryBuilder): Promise<any>;
	exists(queryBuilder: QueryBuilder): Promise<boolean>;

	count(queryBuilder: QueryBuilder): Promise<number>;
	average(queryBuilder: QueryBuilder, column: TColumn): Promise<number>;
	sum(queryBuilder: QueryBuilder, column: TColumn): Promise<number>;
	min(queryBuilder: QueryBuilder, column: TColumn): Promise<any>;
	max(queryBuilder: QueryBuilder, column: TColumn): Promise<any>;

	insert(queryBuilder: QueryBuilder): Promise<IInsertionResult>;

	update(queryBuilder: QueryBuilder): Promise<IModificationResult>;
	bulkUpdate(queryBuilder: QueryBuilder): Promise<IModificationResult>;

	delete(queryBuilder: QueryBuilder): Promise<IModificationResult>;
	softDelete(queryBuilder: QueryBuilder): Promise<IModificationResult>;
	restore(queryBuilder: QueryBuilder): Promise<IModificationResult>;

	createTable(table: Table): Promise<any>;
	truncateTable(tableName: string): Promise<any>;
	dropTableIfExists(tableName: string): Promise<any>;
	dropTable(tableName: string): Promise<any>;

	setForeignKeyChecks(state: boolean): Promise<any>;

	execute(query: string, params?: TBaseValue[]): Promise<any>;

	closeConnection(): void;
}
