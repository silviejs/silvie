import IValidationRule, { rule } from 'silviePath/validator/rule';
import { isNumeric } from 'validator';

@rule('min')
export default class MinRule implements IValidationRule {
	validate(value: any, minValue: string): boolean {
		const min = Number(minValue);

		if (typeof value === 'number' || isNumeric(`${value}`)) {
			return value >= min;
		}

		if (value instanceof Array || typeof value === 'string') {
			return value.length >= min;
		}

		return false;
	}
}
