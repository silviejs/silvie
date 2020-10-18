import IValidationRule, { rule } from 'src/validator/rule';

@rule('nullable')
export default class NullableRule implements IValidationRule {
	validate(value: any): boolean {
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
