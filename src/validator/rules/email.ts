import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isEmail } from 'validator';

@rule('email')
export default class EmailRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isEmail(value);
	}
}
