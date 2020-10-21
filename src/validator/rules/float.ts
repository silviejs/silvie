import IValidationRule, { rule } from 'src/validator/rule';
import { isFloat } from 'validator';

@rule('float')
export default class FloatRule implements IValidationRule {
	validate(value: any): boolean {
		return isFloat(value);
	}
}
