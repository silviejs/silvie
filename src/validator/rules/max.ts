import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isNumeric } from 'validator';

@rule('max')
export default class MaxRule implements IValidationRule {
	validate(validator: Validator, value: any, maxValue: string): boolean {
		const max = Number(maxValue);

		if (typeof value === 'number' || isNumeric(`${value}`)) {
			return value <= max;
		}

		if (value instanceof Array || typeof value === 'string') {
			return value.length <= max;
		}

		return false;
	}
}
