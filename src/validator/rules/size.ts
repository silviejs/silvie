import IValidationRule, { rule } from 'src/validator/rule';

@rule('email')
export default class EmailRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		if (value instanceof Array || typeof value === 'string') {
			const size = parseInt(key, 10);

			return value.length === size;
		}

		return false;
	}
}
