import IValidationRule, { rule } from 'src/validator/rule';

@rule('length')
export default class LengthRule implements IValidationRule {
	validate(value: any, length: string): boolean {
		if (value instanceof Array || typeof value === 'string') {
			return value.length === parseInt(length, 10);
		}

		return `${value}`.length === parseInt(length, 10);
	}
}
