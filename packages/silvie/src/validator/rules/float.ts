import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isFloat } from 'validator';

@rule('float')
export default class FloatRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isFloat(`${value}`);
	}
}
