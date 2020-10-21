import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('boolean')
export default class BooleanRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		if (typeof value === 'boolean') {
			return true;
		}
		if (typeof value === 'number') {
			return value === 0 || value === 1;
		}
		return ['yes', 'no', 'on', 'off'].includes(value);
	}
}
