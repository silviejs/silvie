import {
	TTable,
	TColumn,
	TValue,
	TBaseValue,
	TOperator,
	TConditionType,
	ICondition,
} from 'src/database/builders/condition';

import { IOrder, IGroup, IUnion, IJoin, ISelect, IAliasTable, TAggregateType } from 'src/database/builders/query/types';
import WhereConditionBuilder from 'src/database/builders/condition/where';
import HavingConditionBuilder from 'src/database/builders/condition/having';
import JoinConditionBuilder from 'src/database/builders/condition/join';
import Database from 'src/database';

export default class QueryBuilder {
	options: {
		table?: TTable;
		aliasTable?: IAliasTable;

		select: ISelect[];
		selectInto?: string;
		processData: (data: any[]) => any[];

		insert?: any[];
		ignoreDuplicates?: boolean;

		update?: any[];
		bulkUpdateData?: any[];
		bulkUpdateKeys?: any[];
		silentUpdate?: boolean;

		where: ICondition[];
		having: ICondition[];
		order: IOrder[];
		group: IGroup[];
		union: IUnion[];
		join: IJoin[];

		randomOrder?: boolean;
		randomSeed?: string;
		offset?: number;
		limit?: number;

		lock?: 'shared' | 'update';

		useTimestamps: boolean;
		createTimestamp: string;
		updateTimestamp: string;

		useSoftDeletes: boolean;
		softDeleteTimestamp: string;
		withTrashed: boolean;
		onlyTrashed: boolean;

		alongQueries: QueryBuilder[];
	};

	constructor(tableName?: string) {
		this.options = {
			select: [],
			where: [],
			having: [],
			order: [],
			group: [],
			union: [],
			join: [],

			processData: (data) => data,

			useTimestamps: true,
			createTimestamp: 'created_at',
			updateTimestamp: 'updated_at',

			useSoftDeletes: false,
			softDeleteTimestamp: 'deleted_at',
			withTrashed: false,
			onlyTrashed: false,

			alongQueries: [],
		};

		if (tableName) {
			this.options.table = tableName;
		}
	}

	/**
	 * Extend the query builder options with a custom options object
	 * @param opts
	 */
	extend(opts: any): QueryBuilder {
		Object.assign(this.options, opts);

		return this;
	}

	/**
	 * Create a new copy of the current query builder
	 */
	clone(): QueryBuilder {
		const qb = new QueryBuilder();
		qb.options = this.options;
		return qb;
	}

	/**
	 * Return all matching rows of this query
	 */
	async get(): Promise<any> {
		return this.options.processData(await Database.proxy('select', this));
	}

	/**
	 * Return the first matching row of this query
	 */
	async first(): Promise<any> {
		const qb = this.clone();
		qb.options.limit = 1;

		return this.options.processData(await Database.proxy('select', qb))[0] || null;
	}

	/**
	 * Query database to see if there are any records matching this query
	 */
	exists(): Promise<boolean> {
		return Database.proxy('exists', this);
	}

	/**
	 * Query database to see if there are no records matching this query
	 */
	async doesntExist(): Promise<boolean> {
		return !(await this.exists());
	}

	/**
	 * Query the database and return with an array of single field or a hashmap
	 * @param keyColumn The column name to use for the keys
	 * @param valueColumn If provided, it will be used to determine key, value pairs
	 * @param override Override the duplicate keys in a hashmap
	 */
	async pluck(keyColumn: TColumn, valueColumn: TColumn = null, override = true): Promise<any> {
		const results = await this.get();

		if (!valueColumn) {
			return results.map((row) => row[keyColumn]);
		}

		return results.reduce((group, row) => {
			const key = row[keyColumn];
			const value = row[valueColumn];

			if (group[key] !== undefined && !override) {
				throw new Error(`Pluck found a duplicate key '${keyColumn}': ${key}'`);
			}

			group[key] = value;

			return group;
		}, {});
	}

	/**
	 * Return the count of records matching this query
	 */
	count(): Promise<number> {
		return Database.proxy('count', this);
	}

	/**
	 * Calculate the average of the specified column
	 * @param column
	 */
	average(column: TColumn): Promise<number> {
		if (!column) {
			throw new Error("Column is not specified for 'average' method");
		}

		return Database.proxy('average', this, column);
	}

	/**
	 * Calculate the summation of the specified column
	 * @param column
	 */
	sum(column: TColumn): Promise<number> {
		if (!column) {
			throw new Error("Column is not specified for 'sum' method");
		}

		return Database.proxy('sum', this, column);
	}

	/**
	 * Find the minimum value of the specified column
	 * @param column
	 */
	min(column: TColumn): Promise<any> {
		if (!column) {
			throw new Error("Column is not specified for 'min' method");
		}

		return Database.proxy('min', this, column);
	}

	/**
	 * Find the maximum value of the specified column
	 * @param column
	 */
	max(column: TColumn): Promise<any> {
		if (!column) {
			throw new Error("Column is not specified for 'max' method");
		}

		return Database.proxy('max', this, column);
	}

	/**
	 * Insert the provided data into the table
	 * @param data Inserting data
	 * @param ignore Weather to ignore duplicate keys or not
	 */
	insert(data: any[], ignore?: boolean): Promise<any> {
		if (data.length === 0) {
			throw new Error('You should provide one or more objects to insert');
		}

		this.options.insert = data;
		this.options.ignoreDuplicates = ignore;

		return Database.proxy('insert', this).then((results) => {
			delete this.options.insert;
			delete this.options.ignoreDuplicates;

			return results;
		});
	}

	/**
	 * Updates the table with the provided data
	 * @param data Updating data
	 * @param silent Weather to keep the update time field or not
	 */
	update(data: any, silent = false): Promise<any> {
		if (!data) {
			throw new Error('You should provide an object to the update method');
		}

		if (Object.keys(data).length === 0) {
			throw new Error('An empty object cannot be used in update method');
		}

		this.options.update = data;
		this.options.silentUpdate = silent;

		return Database.proxy('update', this).then((results) => {
			delete this.options.update;
			delete this.options.silentUpdate;

			return results;
		});
	}

	/**
	 * Update multiple records in the table
	 * @param data Updating data
	 * @param keys Keys used to find the matching row
	 * @param silent Weather to keep the update time or not
	 */
	bulkUpdate(data: any[], keys: string[] = [], silent = false): Promise<any> {
		if (data.length === 0) {
			throw new Error('You should provide one or more data to bulk update');
		}
		if (keys.length === 0) {
			throw new Error('You should provide one or more keys to bulk update');
		}

		this.options.bulkUpdateData = data;
		this.options.bulkUpdateKeys = keys;
		this.options.silentUpdate = silent;

		return Database.proxy('bulkUpdate', this).then((results) => {
			delete this.options.bulkUpdateData;
			delete this.options.bulkUpdateKeys;
			delete this.options.silentUpdate;

			return results;
		});
	}

	/**
	 * Delete the rows matching this query
	 * @param soft Weather to use soft deletes or not
	 */
	delete(soft?: boolean): Promise<any> {
		if ((this.options.useSoftDeletes && soft === undefined) || soft) {
			return this.softDelete();
		}

		return Database.proxy('delete', this);
	}

	/**
	 * Enabled soft deletes for the current query builder instance
	 */
	useSoftDeletes(): QueryBuilder {
		this.options.useSoftDeletes = true;

		return this;
	}

	/**
	 * Soft delete the rows matching this query
	 */
	softDelete(): Promise<any> {
		if (!this.options.useSoftDeletes) {
			throw new Error(`Soft deletes are not enabled for this query builder`);
		}

		if (!this.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		return Database.proxy('softDelete', this);
	}

	/**
	 * Undelete the soft deleted rows matching this query
	 */
	restore(): Promise<any> {
		if (!this.options.useSoftDeletes) {
			throw new Error(`Soft deletes are not enabled for this query builder`);
		}

		if (!this.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		return Database.proxy('restore', this);
	}

	/**
	 * Include soft deleted records in the result
	 */
	withTrashed() {
		if (!this.options.useSoftDeletes) {
			throw new Error(`Soft deletes are not enabled for this query builder`);
		}

		if (!this.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		this.options.withTrashed = true;
		this.options.onlyTrashed = false;

		return this;
	}

	/**
	 * Filter results to soft deleted records
	 */
	onlyTrashed() {
		if (!this.options.useSoftDeletes) {
			throw new Error(`Soft deletes are not enabled for this query builder`);
		}

		if (!this.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		this.options.withTrashed = false;
		this.options.onlyTrashed = true;

		return this;
	}

	/**
	 * Exclude soft deleted records from the result
	 */
	withoutTrashed() {
		if (!this.options.useSoftDeletes) {
			throw new Error(`Soft deletes are not enabled for this query builder`);
		}

		if (!this.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		this.options.withTrashed = false;
		this.options.onlyTrashed = false;

		return this;
	}

	/**
	 * Set a shared lock on this query
	 */
	sharedLock(): QueryBuilder {
		this.options.lock = 'shared';

		return this;
	}

	/**
	 * Set a lock for update on this query
	 */
	lockForUpdate(): QueryBuilder {
		this.options.lock = 'update';

		return this;
	}

	/**
	 * Remove the previously set locks
	 */
	clearLock(): QueryBuilder {
		this.options.lock = null;

		return this;
	}

	/**
	 * Set the result of this query into a variable
	 * @param variableName
	 */
	into(variableName: string): QueryBuilder {
		this.options.selectInto = variableName;

		return this;
	}

	/**
	 * Select the current query fields from another query builder
	 * @param queryBuilder Query builder to select from
	 * @param alias Alias name of the resulting table
	 */
	fromAliasTable(queryBuilder: QueryBuilder, alias?: string): QueryBuilder {
		this.options.aliasTable = {
			queryBuilder,
			alias,
		};

		return this;
	}

	/**
	 * Select a set of columns from the table
	 * @param columns
	 */
	select(...columns: TColumn[]): QueryBuilder {
		this.options.select.push(
			...columns.map((column) => ({
				column,
				type: 'column' as 'column' | 'query' | 'raw',
			}))
		);

		return this;
	}

	/**
	 * Select a query builder as a sub selection
	 * @param queryBuilder Query builder to use in selection
	 * @param alias Alias name for the sub selection
	 */
	selectSub(queryBuilder: QueryBuilder, alias: string): QueryBuilder {
		this.options.select.push({
			queryBuilder,
			alias,
			type: 'query',
		});

		return this;
	}

	/**
	 * Add a raw query as a selection
	 * @param query Query string
	 * @param params Binding parameters
	 */
	selectRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		this.options.select.push({
			query,
			params: params || [],
			type: 'raw',
		});

		return this;
	}

	/**
	 * Order the results by a column
	 * @param column
	 * @param direction
	 */
	orderBy(column: TColumn | QueryBuilder, direction?: 'asc' | 'desc' | 'ASC' | 'DESC'): QueryBuilder {
		const order: IOrder = { direction: direction || 'ASC', type: 'column' };

		if (column instanceof QueryBuilder) {
			order.queryBuilder = column;
			order.type = 'query';
		} else {
			order.column = column;
		}

		this.options.order.push(order);

		return this;
	}

	/**
	 * Add a raw query to the order
	 * @param query
	 * @param params
	 */
	orderByRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		this.options.order.push({ query, params, type: 'raw' });

		return this;
	}

	/**
	 * Clear previously set orders or set a fresh order
	 * @param column
	 * @param direction
	 */
	reorder(column?: TColumn, direction?: 'asc' | 'desc' | 'ASC' | 'DESC'): QueryBuilder {
		this.options.order = [];

		if (column) {
			return this.orderBy(column, direction);
		}

		return this;
	}

	/**
	 * Randomize the result order
	 * @param seed Seed to use in the random function
	 */
	shuffle(seed?: string): QueryBuilder {
		this.options.randomOrder = true;
		this.options.randomSeed = seed || '';

		return this;
	}

	/**
	 * Skip the first n rows
	 * @param count
	 */
	offset(count: number): QueryBuilder {
		this.options.offset = count;

		return this;
	}

	/**
	 * Skip the first n rows
	 * @param count
	 */
	skip(count: number): QueryBuilder {
		return this.offset(count);
	}

	/**
	 * Take the next m rows
	 * @param count
	 */
	limit(count: number): QueryBuilder {
		this.options.limit = count;

		return this;
	}

	/**
	 * Take the next m rows
	 * @param count
	 */
	take(count: number): QueryBuilder {
		return this.limit(count);
	}

	private baseAggregate(type: TAggregateType, column: TColumn, alias: string, meta?: any): QueryBuilder {
		this.options.select.push({
			type: 'aggregate',
			aggregation: type,
			column,
			alias,
			meta,
		});

		return this;
	}

	/**
	 * Select the count of matching rows in the field set
	 * @param alias
	 */
	selectCount(alias: string): QueryBuilder {
		return this.baseAggregate('count', '*', alias);
	}

	/**
	 * Select the average of specified column in the field set
	 * @param column Column to get average
	 * @param alias Alias name for the new field
	 */
	selectAverage(column: TColumn, alias: string): QueryBuilder {
		return this.baseAggregate('average', column, alias);
	}

	/**
	 * Select the average of specified column in the field set
	 * @param column Column to get summation
	 * @param alias Alias name for the new field
	 */
	selectSum(column: TColumn, alias: string): QueryBuilder {
		return this.baseAggregate('summation', column, alias);
	}

	/**
	 * Select the minimum value of specified column in the field set
	 * @param column Column to get summation
	 * @param alias Alias name for the new field
	 */
	selectMin(column: TColumn, alias: string): QueryBuilder {
		return this.baseAggregate('minimum', column, alias);
	}

	/**
	 * Select the maximum value of specified column in the field set
	 * @param column Column to get summation
	 * @param alias Alias name for the new field
	 */
	selectMax(column: TColumn, alias: string): QueryBuilder {
		return this.baseAggregate('maximum', column, alias);
	}

	/**
	 * Group the results by the specified columns
	 * @param columns
	 */
	groupBy(...columns: TColumn[]): QueryBuilder {
		this.options.group.push(
			...columns.map((column) => ({
				column,
				type: 'column' as 'column' | 'raw',
			}))
		);

		return this;
	}

	/**
	 * Group the results by the specified raw query
	 * @param query
	 * @param params
	 */
	groupByRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		this.options.group.push({
			query,
			params,
			type: 'raw',
		});

		return this;
	}

	/**
	 * Union the selection with a query builder instance
	 * @param queryBuilder
	 * @param all
	 */
	union(queryBuilder: QueryBuilder, all = false): QueryBuilder {
		this.options.union.push({
			queryBuilder,
			all,
			type: 'query',
		});

		return this;
	}

	/**
	 * Union the selection with a raw query
	 * @param query
	 * @param params
	 * @param all
	 */
	unionRaw(query: string, params?: TBaseValue[], all = false): QueryBuilder {
		this.options.union.push({
			query,
			params,
			all,
			type: 'raw',
		});

		return this;
	}

	private baseJoin(
		type: 'inner' | 'left' | 'right' | 'cross' | 'outer',
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	): QueryBuilder {
		const join: IJoin = {
			type,
		};

		if (column1 instanceof Function) {
			const conditionBuilder = new JoinConditionBuilder();
			column1(conditionBuilder);

			join.conditions = conditionBuilder.conditions;
			if (typeof operator === 'string') {
				join.alias = operator;
			}
		} else {
			join.column1 = column1;

			if (alias === undefined) {
				if (column2 === undefined) {
					if (operator === undefined) {
						throw new Error(`Invalid usage of ${type} join`);
					} else {
						join.operator = '=';
						join.column2 = operator;
					}
				} else {
					join.operator = operator as TOperator;
					join.column2 = column2;
				}
			} else {
				join.operator = operator as TOperator;
				join.column2 = column2;
				join.alias = alias;
			}
		}

		if (table instanceof QueryBuilder) {
			join.queryBuilder = table;

			if (alias === undefined) {
				if (column2 === undefined) {
					throw new Error(`Invalid usage of ${type} join with query builder`);
				} else {
					join.operator = '=';
					join.column2 = operator;
					join.alias = column2;
				}
			} else {
				join.operator = operator as TOperator;
				join.column2 = column2;
				join.alias = alias;
			}
		} else {
			join.table = table;
		}

		this.options.join.push(join);

		return this;
	}

	/**
	 * Inner join the current query with another table or query builder
	 * @param table Joining table or QueryBuilder instance
	 * @param column1 Condition's first column or condition builder callback function
	 * @param operator Custom operator or condition's second column
	 * @param column2 Condition's second column or alias name
	 * @param alias Alias name for the joining table
	 */
	join(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	): QueryBuilder {
		return this.baseJoin('inner', table, column1, operator, column2, alias);
	}

	/**
	 * Left join the current query with another table or query builder
	 * @param table Joining table or QueryBuilder instance
	 * @param column1 Condition's first column or condition builder callback function
	 * @param operator Custom operator or condition's second column
	 * @param column2 Condition's second column or alias name
	 * @param alias Alias name for the joining table
	 */
	leftJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	): QueryBuilder {
		return this.baseJoin('left', table, column1, operator, column2, alias);
	}

	/**
	 * Right join the current query with another table or query builder
	 * @param table Joining table or QueryBuilder instance
	 * @param column1 Condition's first column or condition builder callback function
	 * @param operator Custom operator or condition's second column
	 * @param column2 Condition's second column or alias name
	 * @param alias Alias name for the joining table
	 */
	rightJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	): QueryBuilder {
		return this.baseJoin('right', table, column1, operator, column2, alias);
	}

	/**
	 * Cross join the current query with another table or query builder
	 * @param table Joining table or QueryBuilder instance
	 * @param column1 Condition's first column or condition builder callback function
	 * @param operator Custom operator or condition's second column
	 * @param column2 Condition's second column or alias name
	 * @param alias Alias name for the joining table
	 */
	crossJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	): QueryBuilder {
		return this.baseJoin('cross', table, column1, operator, column2, alias);
	}

	/**
	 * Outer join the current query with another table or query builder
	 * @param table Joining table or QueryBuilder instance
	 * @param column1 Condition's first column or condition builder callback function
	 * @param operator Custom operator or condition's second column
	 * @param column2 Condition's second column or alias name
	 * @param alias Alias name for the joining table
	 */
	outerJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	): QueryBuilder {
		return this.baseJoin('outer', table, column1, operator, column2, alias);
	}

	private baseWhere(
		type: TConditionType,
		relation: 'and' | 'or',
		lhs: TColumn | QueryBuilder | ((conditionBuilder: WhereConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		rhs?: TColumn | TValue | QueryBuilder
	) {
		if (this.options.where.length === 0 && relation === 'or') {
			throw new Error(`You cannot use conditions with or relation as the first where condition`);
		}

		const condition: ICondition = { type, relation };

		if (lhs instanceof Function) {
			const conditionBuilder = new WhereConditionBuilder();
			lhs(conditionBuilder);

			condition.type = 'group';
			condition.conditions = conditionBuilder.conditions;
		} else {
			condition.leftHandSide = lhs;

			if (rhs === undefined) {
				if (operator === undefined) {
					if (!type.endsWith('null')) {
						throw new Error(`Invalid usage of ${type} where`);
					}
				} else {
					if (!['between', 'not between', 'in', 'not in', 'like', 'not like'].includes(type)) {
						condition.operator = '=';
					}

					condition.rightHandSide = operator;
				}
			} else {
				if (operator) condition.operator = operator as TOperator;

				condition.rightHandSide = rhs;
			}
		}

		this.options.where.push(condition);

		return this;
	}

	where(
		column: TColumn | QueryBuilder | ((conditionBuilder: WhereConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('value', 'and', column, operator, value);
	}

	orWhere(
		column: TColumn | QueryBuilder | ((conditionBuilder: WhereConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('value', 'or', column, operator, value);
	}

	whereNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseWhere('null', 'and', column);
	}

	orWhereNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseWhere('null', 'or', column);
	}

	whereNotNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseWhere('not null', 'and', column);
	}

	orWhereNotNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseWhere('not null', 'or', column);
	}

	whereBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('between', 'and', column, values);
	}

	orWhereBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('between', 'and', column, values);
	}

	whereNotBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('not between', 'and', column, values);
	}

	orWhereNotBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('not between', 'and', column, values);
	}

	whereIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseWhere('in', 'and', column, values);
	}

	orWhereIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseWhere('in', 'or', column, values);
	}

	whereNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseWhere('not in', 'and', column, values);
	}

	orWhereNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseWhere('not in', 'or', column, values);
	}

	whereLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseWhere('like', 'and', column, value);
	}

	orWhereLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseWhere('like', 'or', column, value);
	}

	whereNotLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseWhere('not like', 'and', column, value);
	}

	orWhereNotLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseWhere('not like', 'or', column, value);
	}

	whereColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): QueryBuilder {
		return this.baseWhere('column', 'and', firstColumn, operator, secondColumn);
	}

	orWhereColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): QueryBuilder {
		return this.baseWhere('column', 'or', firstColumn, operator, secondColumn);
	}

	whereDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('date', 'and', column, operator, value);
	}

	orWhereDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('date', 'or', column, operator, value);
	}

	whereYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('year', 'and', column, operator, value);
	}

	orWhereYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('year', 'or', column, operator, value);
	}

	whereMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('month', 'and', column, operator, value);
	}

	orWhereMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('month', 'or', column, operator, value);
	}

	whereDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('day', 'and', column, operator, value);
	}

	orWhereDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('day', 'or', column, operator, value);
	}

	whereTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('time', 'and', column, operator, value);
	}

	orWhereTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('time', 'or', column, operator, value);
	}

	whereRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		this.options.where.push({
			type: 'raw',
			relation: 'and',
			query,
			params: params || [],
		});

		return this;
	}

	orWhereRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		if (this.options.where.length === 0) {
			throw new Error(`You cannot use conditions with or relation as the first where condition`);
		}

		this.options.where.push({
			type: 'raw',
			relation: 'or',
			query,
			params: params || [],
		});

		return this;
	}

	private baseHaving(
		type: TConditionType,
		relation: 'and' | 'or',
		lhs: TColumn | QueryBuilder | ((conditionBuilder: HavingConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		rhs?: TColumn | TValue | QueryBuilder
	) {
		if (this.options.where.length === 0 && relation === 'or') {
			throw new Error(`You cannot use conditions with or relation as the first having condition`);
		}

		const condition: ICondition = { type, relation };

		if (lhs instanceof Function) {
			const conditionBuilder = new HavingConditionBuilder();
			lhs(conditionBuilder);

			condition.type = 'group';
			condition.conditions = conditionBuilder.conditions;
		} else {
			condition.leftHandSide = lhs;

			if (rhs === undefined) {
				if (operator === undefined) {
					if (!type.endsWith('null')) {
						throw new Error(`Invalid usage of ${type} having`);
					}
				} else {
					if (!['between', 'not between', 'in', 'not in', 'like', 'not like'].includes(type)) {
						condition.operator = '=';
					}

					condition.rightHandSide = operator;
				}
			} else {
				if (operator) condition.operator = operator as TOperator;

				condition.rightHandSide = rhs;
			}
		}

		this.options.having.push(condition);

		return this;
	}

	having(
		column: TColumn | QueryBuilder | ((conditionBuilder: HavingConditionBuilder) => void),
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('value', 'and', column, operator, value);
	}

	orHaving(
		column: TColumn | QueryBuilder | ((conditionBuilder: HavingConditionBuilder) => void),
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('value', 'or', column, operator, value);
	}

	havingNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseHaving('null', 'and', column);
	}

	orHavingNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseHaving('null', 'or', column);
	}

	havingNotNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseHaving('not null', 'and', column);
	}

	orHavingNotNull(column: TColumn | QueryBuilder): QueryBuilder {
		return this.baseHaving('not null', 'or', column);
	}

	havingBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('between', 'and', column, values);
	}

	orHavingBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('between', 'and', column, values);
	}

	havingNotBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('not between', 'and', column, values);
	}

	orHavingNotBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('not between', 'and', column, values);
	}

	havingIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseHaving('in', 'and', column, values);
	}

	orHavingIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseHaving('in', 'or', column, values);
	}

	havingNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseHaving('not in', 'and', column, values);
	}

	orHavingNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): QueryBuilder {
		return this.baseHaving('not in', 'or', column, values);
	}

	havingLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseHaving('like', 'and', column, value);
	}

	orHavingLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseHaving('like', 'or', column, value);
	}

	havingNotLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseHaving('not like', 'and', column, value);
	}

	orHavingNotLike(column: TColumn | QueryBuilder, value: TValue): QueryBuilder {
		return this.baseHaving('not like', 'or', column, value);
	}

	havingColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): QueryBuilder {
		return this.baseHaving('column', 'and', firstColumn, operator, secondColumn);
	}

	orHavingColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): QueryBuilder {
		return this.baseHaving('column', 'or', firstColumn, operator, secondColumn);
	}

	havingDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('date', 'and', column, operator, value);
	}

	orHavingDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('date', 'or', column, operator, value);
	}

	havingYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('year', 'and', column, operator, value);
	}

	orHavingYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('year', 'or', column, operator, value);
	}

	havingMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('month', 'and', column, operator, value);
	}

	orHavingMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('month', 'or', column, operator, value);
	}

	havingDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('day', 'and', column, operator, value);
	}

	orHavingDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('day', 'or', column, operator, value);
	}

	havingTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('time', 'and', column, operator, value);
	}

	orHavingTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('time', 'or', column, operator, value);
	}

	havingRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		this.options.having.push({
			type: 'raw',
			relation: 'and',
			query,
			params: params || [],
		});

		return this;
	}

	orHavingRaw(query: string, params?: TBaseValue[]): QueryBuilder {
		if (this.options.where.length === 0) {
			throw new Error(`You cannot use conditions with or relation as the first having condition`);
		}

		this.options.having.push({
			type: 'raw',
			relation: 'or',
			query,
			params: params || [],
		});

		return this;
	}

	alongWith(queryBuilder: QueryBuilder): QueryBuilder {
		this.options.alongQueries.push(queryBuilder);

		return this;
	}
}
