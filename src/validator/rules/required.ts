import IValidationRule, { rule } from 'src/validator/rule';

@rule('required')
export default class RequiredRule implements IValidationRule {
	validate(value: any): boolean {
		if (value !== null && value !== undefined) {
			if (typeof value === 'string') {
				return value.trim().length > 0 || null;
			}

			if (value instanceof Array) {
				return value.length > 0 || null;
			}

			return true;
		}

		return null;
	}
}
