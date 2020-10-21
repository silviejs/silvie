import IValidationRule, { rule } from 'src/validator/rule';

@rule('startsWith')
export default class StartsWithRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		if (typeof value === 'string') {
			return value.startsWith(key);
		}

		return false;
	}
}
