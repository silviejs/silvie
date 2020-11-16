import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('nullable')
export default class NullableRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		if (value !== null && value !== undefined) {
			if (typeof value === 'string') {
				return value.trim().length > 0;
			}

			if (value instanceof Array) {
				return value.length > 0;
			}

			return true;
		}

		return undefined;
	}
}
