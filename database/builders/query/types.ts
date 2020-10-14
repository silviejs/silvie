import { TBaseValue, TTable, TColumn, TOperator, ICondition } from 'silviePath/database/builders/condition';
import QueryBuilder from 'silviePath/database/builders/query/index';

export type TAggregateType = 'count' | 'average' | 'summation' | 'minimum' | 'maximum';

export interface IOrder {
	column?: TColumn;
	queryBuilder?: QueryBuilder;
	direction?: 'asc' | 'desc' | 'ASC' | 'DESC';
	type: 'column' | 'raw' | 'query';
	query?: string;
	params?: TBaseValue[];
}

export interface IAliasTable {
	queryBuilder: QueryBuilder;
	alias?: string;
}

export interface IGroup {
	column?: TColumn;
	type: 'column' | 'raw';
	query?: string;
	params?: TBaseValue[];
}

export interface IUnion {
	queryBuilder?: QueryBuilder;
	query?: string;
	params?: TBaseValue[];
	all: boolean;
	type: 'query' | 'raw';
}

export interface IJoin {
	table?: TTable;
	queryBuilder?: QueryBuilder;
	conditions?: ICondition[];
	column1?: TColumn;
	operator?: TOperator;
	column2?: TColumn;
	alias?: string;
	type?: 'inner' | 'left' | 'right' | 'cross' | 'outer';
}

export interface ISelect {
	column?: TColumn;
	queryBuilder?: QueryBuilder;
	alias?: string;
	query?: string;
	params?: TBaseValue[];
	type?: 'column' | 'query' | 'raw' | 'aggregate';
	aggregation?: TAggregateType;
	meta?: any;
}
