import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('size')
export default class SizeRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, key: string): boolean {
		if (value instanceof Array || typeof value === 'string') {
			const size = parseInt(key, 10);

			return value.length === size;
		}

		return false;
	}
}
