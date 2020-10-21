import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('distinct')
export default class DistinctRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		if (value instanceof Array) {
			return value.length === new Set(value).size;
		}

		return false;
	}
}
