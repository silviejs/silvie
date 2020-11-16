import QueryBuilder from 'src/database/builders/query';

export declare type TOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';
export declare type TBaseValue = string | number | boolean;
export declare type TValue = string | number | boolean | TBaseValue[];
export declare type TColumn = string;
export declare type TTable = string;
export declare type TConditionType =
	| 'group'
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
	// eslint-disable-next-line no-use-before-define
	leftHandSide?: TColumn | QueryBuilder | ((conditionBuilder: IConditionBuilder) => void);
	operator?: TOperator;
	rightHandSide?: TColumn | TValue | QueryBuilder;
	conditions?: ICondition[];
	relation?: 'and' | 'or';
	type: TConditionType;
	query?: string;
	params?: TBaseValue[];
}

export default interface IConditionBuilder {
	conditions: ICondition[];
}
