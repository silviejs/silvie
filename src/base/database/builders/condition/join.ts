import IConditionBuilder, {
	ICondition,
	TColumn,
	TValue,
	TConditionType,
	TOperator,
	TBaseValue,
} from 'base/database/builders/condition';

import QueryBuilder from 'base/database/builders/query';

export default class JoinConditionBuilder implements IConditionBuilder {
	conditions: ICondition[];

	constructor() {
		this.conditions = [];
	}

	private baseOn(
		type: TConditionType,
		relation: 'and' | 'or',
		lhs: TColumn | QueryBuilder | ((conditionBuilder: JoinConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		rhs?: TColumn | TValue | QueryBuilder
	) {
		if (this.conditions.length === 0 && relation === 'or') {
			throw new Error(`You cannot use conditions with or relation as the first condition in JoinConditionBuilder`);
		}

		const condition: ICondition = { type, relation };

		if (lhs instanceof Function) {
			const conditionBuilder = new JoinConditionBuilder();
			lhs(conditionBuilder);

			condition.type = 'group';
			condition.conditions = conditionBuilder.conditions;
		} else {
			condition.leftHandSide = lhs;

			if (rhs === undefined) {
				if (operator === undefined) {
					if (!type.endsWith('null')) {
						throw new Error(`Invalid usage of ${type} on`);
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

	on(
		column: TColumn | QueryBuilder | ((conditionBuilder: JoinConditionBuilder) => void),
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('value', 'and', column, operator, value);
	}

	orOn(
		column: TColumn | QueryBuilder | ((conditionBuilder: JoinConditionBuilder) => void),
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('value', 'or', column, operator, value);
	}

	onNull(column: TColumn | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('null', 'and', column);
	}

	orOnNull(column: TColumn | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('null', 'or', column);
	}

	onNotNull(column: TColumn | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('not null', 'and', column);
	}

	orOnNotNull(column: TColumn | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('not null', 'or', column);
	}

	onBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('between', 'and', column, values);
	}

	orOnBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('between', 'and', column, values);
	}

	onNotBetween(column: TColumn | QueryBuilder, values: [TBaseValue, TBaseValue] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('not between', 'and', column, values);
	}

	orOnNotBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('not between', 'and', column, values);
	}

	onIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('in', 'and', column, values);
	}

	orOnIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('in', 'or', column, values);
	}

	onNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('not in', 'and', column, values);
	}

	orOnNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): JoinConditionBuilder {
		return this.baseOn('not in', 'or', column, values);
	}

	onLike(column: TColumn | QueryBuilder, value: TValue): JoinConditionBuilder {
		return this.baseOn('like', 'and', column, value);
	}

	orOnLike(column: TColumn | QueryBuilder, value: TValue): JoinConditionBuilder {
		return this.baseOn('like', 'or', column, value);
	}

	onNotLike(column: TColumn | QueryBuilder, value: TValue): JoinConditionBuilder {
		return this.baseOn('not like', 'and', column, value);
	}

	orOnNotLike(column: TColumn | QueryBuilder, value: TValue): JoinConditionBuilder {
		return this.baseOn('not like', 'or', column, value);
	}

	onColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): JoinConditionBuilder {
		return this.baseOn('column', 'and', firstColumn, operator, secondColumn);
	}

	orOnColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): JoinConditionBuilder {
		return this.baseOn('column', 'or', firstColumn, operator, secondColumn);
	}

	onDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('date', 'and', column, operator, value);
	}

	orOnDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('date', 'or', column, operator, value);
	}

	onYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('year', 'and', column, operator, value);
	}

	orOnYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('year', 'or', column, operator, value);
	}

	onMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('month', 'and', column, operator, value);
	}

	orOnMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('month', 'or', column, operator, value);
	}

	onDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('day', 'and', column, operator, value);
	}

	orOnDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('day', 'or', column, operator, value);
	}

	onTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('time', 'and', column, operator, value);
	}

	orOnTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TValue | QueryBuilder,
		value?: TValue | QueryBuilder
	): JoinConditionBuilder {
		return this.baseOn('time', 'or', column, operator, value);
	}

	onRaw(query: string, params?: TBaseValue[]): JoinConditionBuilder {
		this.conditions.push({
			type: 'raw',
			relation: 'and',
			query,
			params: params || [],
		});

		return this;
	}

	orOnRaw(query: string, params?: TBaseValue[]): JoinConditionBuilder {
		if (this.conditions.length === 0) {
			throw new Error(`You cannot use conditions with or relation as the first condition in JoinConditionBuilder`);
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
