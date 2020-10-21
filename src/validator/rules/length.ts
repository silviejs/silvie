import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('length')
export default class LengthRule implements IValidationRule {
	validate(validator: Validator, value: any, length: string): boolean {
		if (value instanceof Array || typeof value === 'string') {
			return value.length === parseInt(length, 10);
		}

		return `${value}`.length === parseInt(length, 10);
	}
}
