import IValidationRule, { rule } from 'src/validator/rule';
import { isEmail } from 'validator';

@rule('email')
export default class EmailRule implements IValidationRule {
	validate(value: any): boolean {
		return isEmail(value);
	}
}
