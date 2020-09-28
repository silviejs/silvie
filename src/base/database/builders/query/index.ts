import {
	TTable,
	TColumn,
	TValue,
	TBaseValue,
	TOperator,
	TConditionType,
	ICondition,
} from 'base/database/builders/condition';

import { IOrder, IGroup, IUnion, IJoin, ISelect } from 'base/database/builders/query/types';
import WhereConditionBuilder from 'base/database/builders/condition/where';
import HavingConditionBuilder from 'base/database/builders/condition/having';
import JoinConditionBuilder from 'base/database/builders/condition/join';

import Database from 'base/database';

export default class QueryBuilder {
	options: {
		table: TTable;

		select: ISelect[];
		insert: any[];

		where: ICondition[];
		having: ICondition[];
		order: IOrder[];
		group: IGroup[];
		union: IUnion[];
		join: IJoin[];

		selectInto?: string;

		randomOrder?: boolean;
		randomSeed?: string;
		offset?: number;
		limit?: number;

		lock?: 'shared' | 'update';
	};

	constructor(tableName: string) {
		this.options = {
			table: tableName,

			select: [],
			insert: [],

			where: [],
			having: [],
			order: [],
			group: [],
			union: [],
			join: [],
		};
	}

	get(): Promise<any> {}

	insert(data: any[]): Promise<any> {
		this.options.insert = data;

		return Database.insert(this);
	}

	update(data: any): Promise<any> {}

	bulkUpdate(data: any[]): Promise<any> {}

	delete(): Promise<any> {}

	softDelete(): Promise<any> {}

	sharedLock() {
		this.options.lock = 'shared';

		return this;
	}

	lockForUpdate() {
		this.options.lock = 'update';

		return this;
	}

	clearLock() {
		this.options.lock = null;

		return this;
	}

	into(variableName: string) {
		this.options.selectInto = variableName;

		return this;
	}

	select(...columns: TColumn[]) {
		this.options.select.push(
			...columns.map((column) => ({
				column,
				type: 'column' as 'column' | 'query' | 'raw',
			}))
		);

		return this;
	}

	selectSub(queryBuilder: QueryBuilder, alias: string) {
		this.options.select.push({
			queryBuilder,
			alias,
			type: 'query',
		});

		return this;
	}

	selectRaw(query: string, params?: TBaseValue[]) {
		this.options.select.push({
			query,
			params,
			type: 'raw',
		});

		return this;
	}

	orderBy(column: string, direction?: 'asc' | 'desc' | 'ASC' | 'DESC') {
		this.options.order.push({ column, direction: direction || 'ASC', type: 'column' });

		return this;
	}

	orderByRaw(query: string, params?: TBaseValue[]) {
		this.options.order.push({ query, params, type: 'raw' });

		return this;
	}

	reorder(column?: TColumn, direction?: 'asc' | 'desc' | 'ASC' | 'DESC') {
		this.options.order = [];

		if (column) {
			return this.orderBy(column, direction);
		}

		return this;
	}

	shuffle(seed?: string) {
		this.options.randomOrder = true;
		this.options.randomSeed = seed || '';

		return this;
	}

	offset(count: number) {
		this.options.offset = count;

		return this;
	}

	skip(count: number) {
		return this.offset(count);
	}

	limit(count: number) {
		this.options.limit = count;

		return this;
	}

	take(count: number) {
		return this.limit(count);
	}

	groupBy(...columns: TColumn[]) {
		this.options.group.push(
			...columns.map((column) => ({
				column,
				type: 'column' as 'column' | 'raw',
			}))
		);

		return this;
	}

	groupByRaw(query: string, params?: TBaseValue[]) {
		this.options.group.push({
			query,
			params,
			type: 'raw',
		});

		return this;
	}

	union(queryBuilder: QueryBuilder) {
		this.options.union.push({
			queryBuilder,
			all: false,
			type: 'query',
		});

		return this;
	}

	unionRaw(query: string, params?: TBaseValue[]) {
		this.options.union.push({
			query,
			params,
			all: false,
			type: 'raw',
		});

		return this;
	}

	unionAll(queryBuilder: QueryBuilder) {
		this.options.union.push({
			queryBuilder,
			all: true,
			type: 'query',
		});

		return this;
	}

	unionAllRaw(query: string, params?: TBaseValue[]) {
		this.options.union.push({
			query,
			params,
			all: true,
			type: 'raw',
		});

		return this;
	}

	baseJoin(
		type: 'inner' | 'left' | 'right' | 'cross' | 'outer',
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	) {
		const join: IJoin = {
			type,
		};

		if (column1 instanceof Function) {
			join.conditionBuilder = new JoinConditionBuilder();
			column1(join.conditionBuilder);

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
		} else {
			join.table = table;
		}

		this.options.join.push(join);

		return this;
	}

	join(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	) {
		return this.baseJoin('inner', table, column1, operator, column2, alias);
	}

	leftJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	) {
		return this.baseJoin('left', table, column1, operator, column2, alias);
	}

	rightJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	) {
		return this.baseJoin('right', table, column1, operator, column2, alias);
	}

	crossJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	) {
		return this.baseJoin('cross', table, column1, operator, column2, alias);
	}

	outerJoin(
		table: TTable | QueryBuilder,
		column1: TColumn | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TColumn,
		column2?: TColumn,
		alias?: string
	) {
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

	whereBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('between', 'and', column, values);
	}

	orWhereBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('between', 'and', column, values);
	}

	whereNotBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('not between', 'and', column, values);
	}

	orWhereNotBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseWhere('not between', 'and', column, values);
	}

	whereIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
		return this.baseWhere('in', 'and', column, values);
	}

	orWhereIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
		return this.baseWhere('in', 'or', column, values);
	}

	whereNotIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
		return this.baseWhere('not in', 'and', column, values);
	}

	orWhereNotIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
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

	whereColumn(
		firstColumn: TColumn | QueryBuilder,
		operator: TOperator | TColumn | QueryBuilder,
		secondColumn?: TColumn | QueryBuilder
	): QueryBuilder {
		return this.baseWhere('column', 'and', firstColumn, operator, secondColumn);
	}

	orWhereColumn(
		firstColumn: TColumn | QueryBuilder,
		operator: TOperator | TColumn | QueryBuilder,
		secondColumn?: TColumn | QueryBuilder
	): QueryBuilder {
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

	havingBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('between', 'and', column, values);
	}

	orHavingBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('between', 'and', column, values);
	}

	havingNotBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('not between', 'and', column, values);
	}

	orHavingNotBetween(column: TColumn | QueryBuilder, values: [TValue, TValue] | QueryBuilder): QueryBuilder {
		return this.baseHaving('not between', 'and', column, values);
	}

	havingIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
		return this.baseHaving('in', 'and', column, values);
	}

	orHavingIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
		return this.baseHaving('in', 'or', column, values);
	}

	havingNotIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
		return this.baseHaving('not in', 'and', column, values);
	}

	orHavingNotIn(column: TColumn | QueryBuilder, values: TValue[]): QueryBuilder {
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

	havingColumn(
		firstColumn: TColumn | QueryBuilder,
		operator: TOperator | TColumn | QueryBuilder,
		secondColumn?: TColumn | QueryBuilder
	): QueryBuilder {
		return this.baseHaving('column', 'and', firstColumn, operator, secondColumn);
	}

	orHavingColumn(
		firstColumn: TColumn | QueryBuilder,
		operator: TOperator | TColumn | QueryBuilder,
		secondColumn?: TColumn | QueryBuilder
	): QueryBuilder {
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
}
