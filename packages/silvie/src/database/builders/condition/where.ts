import IConditionBuilder, {
	ICondition,
	TColumn,
	TValue,
	TConditionType,
	TOperator,
	TBaseValue,
} from 'src/database/builders/condition/index';

import QueryBuilder from 'src/database/builders/query';

export default class WhereConditionBuilder implements IConditionBuilder {
	conditions: ICondition[];

	constructor() {
		this.conditions = [];
	}

	private baseWhere(
		type: TConditionType,
		relation: 'and' | 'or',
		lhs: TColumn | QueryBuilder | ((conditionBuilder: WhereConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		rhs?: TColumn | TValue | QueryBuilder
	) {
		if (this.conditions.length === 0 && relation === 'or') {
			throw new Error(`You cannot use conditions with or relation as the first condition in WhereConditionBuilder`);
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

		this.conditions.push(condition);

		return this;
	}

	where(
		column: TColumn | QueryBuilder | ((conditionBuilder: WhereConditionBuilder) => void),
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('value', 'and', column, operator, value);
	}

	orWhere(
		column: TColumn | QueryBuilder | ((conditionBuilder: WhereConditionBuilder) => void),
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('value', 'or', column, operator, value);
	}

	whereNull(column: TColumn | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('null', 'and', column);
	}

	orWhereNull(column: TColumn | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('null', 'or', column);
	}

	whereNotNull(column: TColumn | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('not null', 'and', column);
	}

	orWhereNotNull(column: TColumn | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('not null', 'or', column);
	}

	whereBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('between', 'and', column, values);
	}

	orWhereBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('between', 'and', column, values);
	}

	whereNotBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('not between', 'and', column, values);
	}

	orWhereNotBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('not between', 'and', column, values);
	}

	whereIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('in', 'and', column, values);
	}

	orWhereIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('in', 'or', column, values);
	}

	whereNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('not in', 'and', column, values);
	}

	orWhereNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): WhereConditionBuilder {
		return this.baseWhere('not in', 'or', column, values);
	}

	whereLike(column: TColumn | QueryBuilder, value: string): WhereConditionBuilder {
		return this.baseWhere('like', 'and', column, value);
	}

	orWhereLike(column: TColumn | QueryBuilder, value: string): WhereConditionBuilder {
		return this.baseWhere('like', 'or', column, value);
	}

	whereNotLike(column: TColumn | QueryBuilder, value: string): WhereConditionBuilder {
		return this.baseWhere('not like', 'and', column, value);
	}

	orWhereNotLike(column: TColumn | QueryBuilder, value: string): WhereConditionBuilder {
		return this.baseWhere('not like', 'or', column, value);
	}

	whereColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): WhereConditionBuilder {
		return this.baseWhere('column', 'and', firstColumn, operator, secondColumn);
	}

	orWhereColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): WhereConditionBuilder {
		return this.baseWhere('column', 'or', firstColumn, operator, secondColumn);
	}

	whereDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('date', 'and', column, operator, value);
	}

	orWhereDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('date', 'or', column, operator, value);
	}

	whereYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('year', 'and', column, operator, value);
	}

	orWhereYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('year', 'or', column, operator, value);
	}

	whereMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('month', 'and', column, operator, value);
	}

	orWhereMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('month', 'or', column, operator, value);
	}

	whereDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('day', 'and', column, operator, value);
	}

	orWhereDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('day', 'or', column, operator, value);
	}

	whereTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('time', 'and', column, operator, value);
	}

	orWhereTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): WhereConditionBuilder {
		return this.baseWhere('time', 'or', column, operator, value);
	}

	whereRaw(query: string, params?: TBaseValue[]): WhereConditionBuilder {
		this.conditions.push({
			type: 'raw',
			relation: 'and',
			query,
			params: params || [],
		});

		return this;
	}

	orWhereRaw(query: string, params?: TBaseValue[]): WhereConditionBuilder {
		if (this.conditions.length === 0) {
			throw new Error(`You cannot use conditions with or relation as the first condition in WhereConditionBuilder`);
		}

		this.conditions.push({
			type: 'raw',
			relation: 'or',
			query,
			params: params || [],
		});

		return this;
	}
}
