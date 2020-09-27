import { TBaseValue, TTable, TColumn, TOperator, TValue } from 'base/database/builders/condition';
import QueryBuilder from 'base/database/builders/query';
import JoinConditionBuilder from 'base/database/builders/condition/join';

export interface IOrder {
	column?: TColumn | QueryBuilder;
	direction?: 'asc' | 'desc' | 'ASC' | 'DESC';
	type: 'column' | 'raw';
	query?: string;
	params?: TBaseValue[];
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
	conditionBuilder?: JoinConditionBuilder;
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
	type?: 'column' | 'query' | 'raw';
}
