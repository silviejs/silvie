import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('email')
export default class EmailRule implements IValidationRule {
	validate(validator: Validator, value: any, key: string): boolean {
		if (value instanceof Array || typeof value === 'string') {
			const size = parseInt(key, 10);

			return value.length === size;
		}

		return false;
	}
}
