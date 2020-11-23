import IConditionBuilder, {
	ICondition,
	TColumn,
	TValue,
	TConditionType,
	TOperator,
	TBaseValue,
} from 'src/database/builders/condition/index';

import QueryBuilder from 'src/database/builders/query';

export default class HavingConditionBuilder implements IConditionBuilder {
	conditions: ICondition[];

	constructor() {
		this.conditions = [];
	}

	private baseHaving(
		type: TConditionType,
		relation: 'and' | 'or',
		lhs: TColumn | QueryBuilder | ((conditionBuilder: HavingConditionBuilder) => void),
		operator?: TOperator | TValue | QueryBuilder,
		rhs?: TColumn | TValue | QueryBuilder
	) {
		if (this.conditions.length === 0 && relation === 'or') {
			throw new Error(`You cannot use conditions with or relation as the first condition in HavingConditionBuilder`);
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

		this.conditions.push(condition);

		return this;
	}

	having(
		column: TColumn | QueryBuilder | ((conditionBuilder: HavingConditionBuilder) => void),
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('value', 'and', column, operator, value);
	}

	orHaving(
		column: TColumn | QueryBuilder | ((conditionBuilder: HavingConditionBuilder) => void),
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('value', 'or', column, operator, value);
	}

	havingNull(column: TColumn | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('null', 'and', column);
	}

	orHavingNull(column: TColumn | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('null', 'or', column);
	}

	havingNotNull(column: TColumn | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('not null', 'and', column);
	}

	orHavingNotNull(column: TColumn | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('not null', 'or', column);
	}

	havingBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('between', 'and', column, values);
	}

	orHavingBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('between', 'and', column, values);
	}

	havingNotBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('not between', 'and', column, values);
	}

	orHavingNotBetween(
		column: TColumn | QueryBuilder,
		values: [TBaseValue, TBaseValue] | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('not between', 'and', column, values);
	}

	havingIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('in', 'and', column, values);
	}

	orHavingIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('in', 'or', column, values);
	}

	havingNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('not in', 'and', column, values);
	}

	orHavingNotIn(column: TColumn | QueryBuilder, values: TBaseValue[] | QueryBuilder): HavingConditionBuilder {
		return this.baseHaving('not in', 'or', column, values);
	}

	havingLike(column: TColumn | QueryBuilder, value: TBaseValue): HavingConditionBuilder {
		return this.baseHaving('like', 'and', column, value);
	}

	orHavingLike(column: TColumn | QueryBuilder, value: TBaseValue): HavingConditionBuilder {
		return this.baseHaving('like', 'or', column, value);
	}

	havingNotLike(column: TColumn | QueryBuilder, value: TBaseValue): HavingConditionBuilder {
		return this.baseHaving('not like', 'and', column, value);
	}

	orHavingNotLike(column: TColumn | QueryBuilder, value: TBaseValue): HavingConditionBuilder {
		return this.baseHaving('not like', 'or', column, value);
	}

	havingColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): HavingConditionBuilder {
		return this.baseHaving('column', 'and', firstColumn, operator, secondColumn);
	}

	orHavingColumn(firstColumn: TColumn, operator: TOperator | TColumn, secondColumn?: TColumn): HavingConditionBuilder {
		return this.baseHaving('column', 'or', firstColumn, operator, secondColumn);
	}

	havingDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('date', 'and', column, operator, value);
	}

	orHavingDate(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('date', 'or', column, operator, value);
	}

	havingYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('year', 'and', column, operator, value);
	}

	orHavingYear(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('year', 'or', column, operator, value);
	}

	havingMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('month', 'and', column, operator, value);
	}

	orHavingMonth(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('month', 'or', column, operator, value);
	}

	havingDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('day', 'and', column, operator, value);
	}

	orHavingDay(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('day', 'or', column, operator, value);
	}

	havingTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('time', 'and', column, operator, value);
	}

	orHavingTime(
		column: TColumn | QueryBuilder,
		operator: TOperator | TBaseValue | QueryBuilder,
		value?: TBaseValue | QueryBuilder
	): HavingConditionBuilder {
		return this.baseHaving('time', 'or', column, operator, value);
	}

	havingRaw(query: string, params?: TBaseValue[]): HavingConditionBuilder {
		this.conditions.push({
			type: 'raw',
			relation: 'and',
			query,
			params: params || [],
		});

		return this;
	}

	orHavingRaw(query: string, params?: TBaseValue[]): HavingConditionBuilder {
		if (this.conditions.length === 0) {
			throw new Error(`You cannot use conditions with or relation as the first condition in HavingConditionBuilder`);
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
