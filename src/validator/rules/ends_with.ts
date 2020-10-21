import IValidationRule, { rule } from 'src/validator/rule';

@rule('endsWith')
export default class EndsWithRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		if (typeof value === 'string') {
			return value.endsWith(key);
		}

		return false;
	}
}
