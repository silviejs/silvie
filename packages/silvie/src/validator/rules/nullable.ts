import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('nullable')
export default class NullableRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		if (value !== null && value !== undefined) {
			if (typeof value === 'string') {
				return value.trim().length > 0 || undefined;
			}

			if (value instanceof Array) {
				return value.length > 0 || undefined;
			}

			return true;
		}

		return undefined;
	}
}
