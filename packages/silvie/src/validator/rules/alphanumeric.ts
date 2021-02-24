import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isAlphanumeric } from 'validator';

@rule('alphanumeric')
export default class AlphaNumericRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isAlphanumeric(value);
	}
}
