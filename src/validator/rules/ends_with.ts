import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('endsWith')
export default class EndsWithRule implements IValidationRule {
	validate(validator: Validator, value: any, key: string): boolean {
		if (typeof value === 'string') {
			return value.endsWith(key);
		}

		return false;
	}
}
