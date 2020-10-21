import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('startsWith')
export default class StartsWithRule implements IValidationRule {
	validate(validator: Validator, value: any, key: string): boolean {
		if (typeof value === 'string') {
			return value.startsWith(key);
		}

		return false;
	}
}
