import QueryBuilder from 'base/database/builders/query';

export declare type TOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';
export declare type TBaseValue = string | number | boolean;
export declare type TValue = string | number | boolean | TValue[];
export declare type TColumn = string;
export declare type TTable = string;
export declare type TConditionType =
	| 'value'
	| 'column'
	| 'null'
	| 'not null'
	| 'between'
	| 'not between'
	| 'like'
	| 'not like'
	| 'in'
	| 'not in'
	| 'date'
	| 'year'
	| 'month'
	| 'day'
	| 'time'
	| 'raw';

export interface ICondition {
	leftHandSide?: TColumn | QueryBuilder | ((conditionBuilder: IConditionBuilder) => void);
	operator?: TOperator;
	rightHandSide?: TColumn | TValue | QueryBuilder;
	conditionBuilder?: IConditionBuilder;
	relation?: 'and' | 'or';
	type: TConditionType;
	query?: string;
	params?: TBaseValue[];
}

export default interface IConditionBuilder {
	conditions: ICondition[];
}
